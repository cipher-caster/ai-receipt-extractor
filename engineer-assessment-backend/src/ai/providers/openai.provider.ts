import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider, ExtractedReceipt } from '../ai.interface';
import { AI_CONSTANTS, SYSTEM_PROMPT } from '../constants';

@Injectable()
export class OpenaiProvider implements AiProvider {
  private readonly logger = new Logger(OpenaiProvider.name);
  readonly name = 'openai';
  private client: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      this.client = new OpenAI({ apiKey });
      this.logger.log('OpenAI provider initialized');
    } else {
      this.logger.warn('OpenAI API key not configured');
    }
  }

  async extractReceipt(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<ExtractedReceipt> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await this.client.chat.completions.create({
      model: AI_CONSTANTS.OPENAI.MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: SYSTEM_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const text = response.choices[0].message.content || '';
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    try {
      return JSON.parse(cleanText) as ExtractedReceipt;
    } catch {
      this.logger.error(`Failed to parse OpenAI response: ${text}`);
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
