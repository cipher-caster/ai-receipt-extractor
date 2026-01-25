import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AI_CONSTANTS } from '../constants';
import { GeminiProvider } from './gemini.provider';

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('GeminiProvider', () => {
  let provider: GeminiProvider;
  let mockGenAI: any;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      generateContent: jest.fn(),
    };
    mockGenAI = {
      getGenerativeModel: jest.fn().mockReturnValue(mockModel),
    };
    (GoogleGenerativeAI as unknown as jest.Mock).mockImplementation(
      () => mockGenAI,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-key'),
          },
        },
      ],
    }).compile();

    provider = module.get<GeminiProvider>(GeminiProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('extractReceipt', () => {
    it('should configure model with responseSchema and extract data', async () => {
      const mockReceiptData = {
        vendorName: 'Gemini Vendor',
        date: '2023-11-28',
        currency: 'EUR',
        total: 50.0,
        gst: 5.0,
        items: [{ name: 'Item A', cost: 45.0 }],
      };

      const mockResult = {
        response: {
          text: jest.fn().mockReturnValue(JSON.stringify(mockReceiptData)),
        },
      };

      mockModel.generateContent.mockResolvedValue(mockResult);

      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/png';

      const result = await provider.extractReceipt(buffer, mimeType);

      // Verify getGenerativeModel was called with correct schema config
      expect(mockGenAI.getGenerativeModel).toHaveBeenCalledWith(
        expect.objectContaining({
          model: AI_CONSTANTS.GEMINI.MODEL,
          generationConfig: expect.objectContaining({
            responseMimeType: 'application/json',
            responseSchema: expect.objectContaining({
              type: SchemaType.OBJECT,
              properties: expect.any(Object),
              required: expect.arrayContaining(['vendorName', 'total']),
            }),
          }),
        }),
      );

      // Verify generateContent was called
      expect(mockModel.generateContent).toHaveBeenCalled();

      // Verify result
      expect(result).toEqual(mockReceiptData);
    });

    it('should throw error if Gemini API fails', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('API Failure'));

      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/png';

      await expect(provider.extractReceipt(buffer, mimeType)).rejects.toThrow(
        'Gemini API Error: API Failure',
      );
    });

    it('should throw error if JSON parsing fails', async () => {
      const mockResult = {
        response: {
          text: jest.fn().mockReturnValue('{ invalid json'),
        },
      };
      mockModel.generateContent.mockResolvedValue(mockResult);

      const buffer = Buffer.from('fake-image');
      const mimeType = 'image/png';

      await expect(provider.extractReceipt(buffer, mimeType)).rejects.toThrow(
        'Failed to parse AI response as JSON',
      );
    });
  });
});
