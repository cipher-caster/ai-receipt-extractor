import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ExtractedReceiptDto, ReceiptResponseDto } from './dto/receipt.dto';

@Injectable()
export class ReceiptService {
  private readonly logger = new Logger(ReceiptService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private aiService: AiService,
  ) {}

  async extractAndSave(
    file: Express.Multer.File,
    provider?: string,
  ): Promise<ReceiptResponseDto> {
    try {
      this.logger.log(`Processing receipt: ${file.originalname}`);

      // Upload to S3
      const imageUrl = await this.storageService.uploadFile(file);
      this.logger.log(`Uploaded to: ${imageUrl}`);

      const extractedData = await this.aiService.extractReceipt(
        file.buffer,
        file.mimetype,
        provider,
      );

      const validatedData = this.validateExtractedData(extractedData);

      const receipt = await this.prisma.receipt.create({
        data: {
          imageUrl,
          date: validatedData.date,
          currency: validatedData.currency,
          vendorName: validatedData.vendorName,
          gst: validatedData.gst,
          total: validatedData.total,
          items: {
            create: validatedData.items.map((item) => ({
              name: item.name,
              cost: item.cost,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      this.logger.log(`Saved receipt with ID: ${receipt.id}`);
      return receipt as unknown as ReceiptResponseDto;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(
        `Error processing receipt: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to process receipt');
    }
  }

  private validateExtractedData(data: unknown): ExtractedReceiptDto {
    const dto = plainToInstance(ExtractedReceiptDto, data);
    const errors = validateSync(dto);

    if (errors.length > 0) {
      const errorMessages = errors.map((e) =>
        Object.values(e.constraints || {}).join(', '),
      );
      this.logger.error(`Validation errors: ${errorMessages.join('; ')}`);
      throw new BadRequestException(
        `Invalid AI response: ${errorMessages.join('; ')}`,
      );
    }

    return dto;
  }

  async getReceipt(id: string): Promise<ReceiptResponseDto | null> {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!receipt) {
      return null;
    }

    return receipt as unknown as ReceiptResponseDto;
  }
}
