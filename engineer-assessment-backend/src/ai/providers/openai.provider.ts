import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider, ExtractedReceipt } from '../ai.interface';
import { AI_CONSTANTS } from '../constants';

@Injectable()
export class OpenaiProvider implements AiProvider {
  private readonly logger = new Logger(OpenaiProvider.name);
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
          role: 'system',
          content:
            'Extract receipt information from the provided image. Use the supplied tool to structure your response.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'extracted_receipt',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              vendorName: { type: ['string', 'null'] },
              date: { type: ['string', 'null'] },
              currency: {
                type: ['string', 'null'],
                description: '3-character ISO 4217 currency code (e.g. USD)',
              },
              total: { type: ['number', 'null'] },
              gst: { type: ['number', 'null'] },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    cost: { type: 'number' },
                  },
                  required: ['name', 'cost'],
                  additionalProperties: false,
                },
              },
            },
            required: [
              'vendorName',
              'date',
              'currency',
              'total',
              'gst',
              'items',
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const choice = response.choices[0];

    if (choice.message.refusal) {
      this.logger.error(
        `Model refused to extract receipt: ${choice.message.refusal}`,
      );
      throw new Error('AI model refused to extract receipt data');
    }

    const content = choice.message.content;
    if (!content) {
      throw new Error('Received empty response from AI model');
    }

    try {
      const result = JSON.parse(content);
      return result as ExtractedReceipt;
    } catch (e) {
      this.logger.error(`Failed to parse extracted JSON: ${content}`, e);
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
