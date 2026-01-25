import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>(
      'AWS_S3_ENDPOINT',
      'http://localhost:4566',
    );
    this.bucket = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
      'receipts',
    );

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_ACCESS_KEY_ID',
          'test',
        ),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          'test',
        ),
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );
      this.logger.log(`Bucket "${this.bucket}" exists.`);
    } catch {
      this.logger.log(`Bucket "${this.bucket}" not found. Creating...`);
      try {
        await this.s3Client.send(
          new CreateBucketCommand({
            Bucket: this.bucket,
          }),
        );
        this.logger.log(`Bucket "${this.bucket}" created successfully.`);
      } catch (createError) {
        this.logger.error(
          `Failed to create bucket "${this.bucket}": ${createError}`,
        );
      }
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const key = `receipts/${randomUUID()}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    this.logger.log(`Uploaded file to ${key}`);

    // Return the URL
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
