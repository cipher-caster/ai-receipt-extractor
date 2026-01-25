import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ExtractedReceipt } from '../ai.interface';

import { AI_CONSTANTS } from '../constants';

@Injectable()
export class GeminiProvider implements AiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
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
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            vendorName: { type: SchemaType.STRING, nullable: true },
            date: { type: SchemaType.STRING, nullable: true },
            currency: {
              type: SchemaType.STRING,
              nullable: true,
              description: '3-character ISO 4217 currency code (e.g. USD)',
            },
            total: { type: SchemaType.NUMBER, nullable: true },
            gst: { type: SchemaType.NUMBER, nullable: true },
            items: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  cost: { type: SchemaType.NUMBER },
                },
                required: ['name', 'cost'],
              },
            },
          },
          required: ['vendorName', 'date', 'currency', 'total', 'gst', 'items'],
        },
      },
    });

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    let result;
    try {
      result = await model.generateContent([
        { text: 'Extract receipt information.' },
        imagePart,
      ]);
    } catch (error) {
      this.logger.error('Gemini API request failed', error);
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    const response = result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text) as ExtractedReceipt;
      return parsed;
    } catch (e) {
      this.logger.error(`Failed to parse Gemini response: ${text}`, e);
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
