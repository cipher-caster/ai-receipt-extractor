import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptResponseDto } from './dto/receipt.dto';
import { ReceiptService } from './receipt.service';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async extractReceipt(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB max file size
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('provider') provider?: string,
  ): Promise<ReceiptResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return await this.receiptService.extractAndSave(file, provider);
  }

  @Get(':id')
  async getReceipt(@Param('id') id: string): Promise<ReceiptResponseDto> {
    const receipt = await this.receiptService.getReceipt(id);
    if (!receipt) {
      throw new BadRequestException('Receipt not found');
    }
    return receipt;
  }
}
