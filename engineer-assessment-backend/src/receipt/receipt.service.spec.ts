import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtractedReceipt } from '../ai/ai.interface';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ReceiptService } from './receipt.service';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let aiService: AiService;
  let storageService: StorageService;
  let prismaService: PrismaService;

  const mockAiService = {
    extractReceipt: jest.fn(),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
  };

  const mockPrismaService = {
    receipt: {
      create: jest.fn(),
    },
    receiptItem: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        { provide: AiService, useValue: mockAiService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    aiService = module.get<AiService>(AiService);
    storageService = module.get<StorageService>(StorageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractAndSave', () => {
    const mockFile = {
      buffer: Buffer.from('test'),
      mimetype: 'image/jpeg',
      originalname: 'test.jpg',
    } as Express.Multer.File;

    const mockExtractedData: ExtractedReceipt = {
      vendorName: 'Test Vendor',
      date: '2023-01-01',
      currency: 'USD',
      total: 100,
      gst: 10,
      items: [
        { name: 'Item 1', cost: 50 },
        { name: 'Item 2', cost: 50 },
      ],
    };

    it('should successfully extract and save receipt data', async () => {
      mockAiService.extractReceipt.mockResolvedValue(mockExtractedData);
      mockStorageService.uploadFile.mockResolvedValue(
        'https://example.com/receipt.jpg',
      );
      mockPrismaService.receipt.create.mockResolvedValue({
        id: 'uuid',
        ...mockExtractedData,
      });

      const result = await service.extractAndSave(mockFile, 'test-provider');

      expect(storageService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(aiService.extractReceipt).toHaveBeenCalledWith(
        mockFile.buffer,
        mockFile.mimetype,
        'test-provider',
      );
      expect(prismaService.receipt.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle invalid AI response (e.g., throwing error)', async () => {
      mockAiService.extractReceipt.mockRejectedValue(new Error('AI Error'));

      await expect(service.extractAndSave(mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle database errors', async () => {
      mockAiService.extractReceipt.mockResolvedValue(mockExtractedData);
      mockStorageService.uploadFile.mockResolvedValue(
        'https://example.com/receipt.jpg',
      );
      mockPrismaService.receipt.create.mockRejectedValue(new Error('DB Error'));

      await expect(service.extractAndSave(mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
