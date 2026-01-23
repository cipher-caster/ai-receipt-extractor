import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ReceiptItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  cost: number;
}

export class ExtractedReceiptDto {
  @IsOptional()
  @IsString()
  date: string | null;

  @IsOptional()
  @IsString()
  currency: string | null;

  @IsOptional()
  @IsString()
  vendorName: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  items: ReceiptItemDto[];

  @IsOptional()
  @IsNumber()
  gst: number | null;

  @IsOptional()
  @IsNumber()
  total: number | null;
}

export class ReceiptResponseDto {
  id: string;
  imageUrl: string;
  date: string | null;
  currency: string | null;
  vendorName: string | null;
  items: ReceiptItemDto[];
  gst: number | null;
  total: number | null;
  isSumValid: boolean;
  createdAt: Date;
}
