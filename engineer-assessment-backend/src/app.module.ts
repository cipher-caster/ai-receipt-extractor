import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReceiptModule } from './receipt/receipt.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ConfigModule, PrismaModule, AiModule, ReceiptModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
