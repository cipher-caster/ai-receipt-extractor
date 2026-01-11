import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ExtractedReceipt } from '../ai.interface';

import { AI_CONSTANTS, SYSTEM_PROMPT } from '../constants';

@Injectable()
export class GeminiProvider implements AiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  readonly name = 'gemini';
  private client: GoogleGenerativeAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.client = new GoogleGenerativeAI(apiKey);
      this.logger.log('Gemini provider initialized');
    } else {
      this.logger.warn('Gemini API key not configured');
    }
  }

  async extractReceipt(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<ExtractedReceipt> {
    if (!this.client) {
      throw new Error('Gemini API key not configured');
    }

    const model = this.client.getGenerativeModel({
      model: AI_CONSTANTS.GEMINI.MODEL,
    });

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    let result;
    try {
      result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
    } catch (error) {
      this.logger.error('Gemini API request failed', error);
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ExtractedReceipt;
    this.logger.log(
      `Extracted receipt: ${parsed.vendorName || 'Unknown vendor'}`,
    );

    return parsed;
  }
}
