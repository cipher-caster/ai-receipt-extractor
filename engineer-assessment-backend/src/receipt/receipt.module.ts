import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { StorageModule } from '../storage/storage.module';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [StorageModule, AiModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
