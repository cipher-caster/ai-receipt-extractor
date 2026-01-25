import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenAI } from 'openai';
import { OpenaiProvider } from './openai.provider';

// Mock OpenAI
jest.mock('openai');

describe('OpenaiProvider', () => {
  let provider: OpenaiProvider;
  let mockOpenAI: any;

  beforeEach(async () => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-key'),
          },
        },
      ],
    }).compile();

    provider = module.get<OpenaiProvider>(OpenaiProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('extractReceipt', () => {
    it('should extract receipt data correctly from structured output', async () => {
      const mockReceiptData = {
        vendorName: 'Test Vendor',
        date: '2023-10-27',
        currency: 'USD',
        total: 123.45,
        gst: 10.0,
        items: [
          { name: 'Item 1', cost: 100.0 },
          { name: 'Item 2', cost: 13.45 },
        ],
      };

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify(mockReceiptData),
              refusal: null,
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/jpeg';

      const result = await provider.extractReceipt(buffer, mimeType);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          response_format: expect.objectContaining({
            type: 'json_schema',
            json_schema: expect.objectContaining({
              strict: true,
              name: 'extracted_receipt',
            }),
          }),
        }),
      );
      expect(result).toEqual(mockReceiptData);
    });

    it('should throw error if model refuses', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: null,
              refusal: "I'm sorry, I cannot help with that.",
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/jpeg';

      await expect(provider.extractReceipt(buffer, mimeType)).rejects.toThrow(
        'AI model refused to extract receipt data',
      );
    });

    it('should throw error if json parsing fails', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '{ invalid json',
              refusal: null,
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);
      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/jpeg';

      await expect(provider.extractReceipt(buffer, mimeType)).rejects.toThrow(
        'Failed to parse AI response as JSON',
      );
    });
  });
});
