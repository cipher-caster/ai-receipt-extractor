import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

describe('ReceiptController', () => {
  let controller: ReceiptController;
  let service: ReceiptService;

  const mockReceiptService = {
    extractAndSave: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [{ provide: ReceiptService, useValue: mockReceiptService }],
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
    service = module.get<ReceiptService>(ReceiptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('extractReceipt', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
    } as Express.Multer.File;

    it('should call service with correct parameters', async () => {
      const mockResult = { id: 'test-id' };
      mockReceiptService.extractAndSave.mockResolvedValue(mockResult);

      const result = await controller.extractReceipt(mockFile, 'openai');

      expect(service.extractAndSave).toHaveBeenCalledWith(mockFile, 'openai');
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException if file is missing (though handled by pipe in prod)', async () => {
      await expect(controller.extractReceipt(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
