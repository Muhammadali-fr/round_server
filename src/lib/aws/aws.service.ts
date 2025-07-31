// libs/aws/aws.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class AwsService {
  private s3: S3Client;

  constructor(private readonly config: ConfigService) {
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID')!;
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY')!;
    const region = this.config.get<string>('AWS_REGION')!;

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `${uuid()}${path.extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.config.get<string>('AWS_S3_BUCKET_NAME')!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://${this.config.get<string>('AWS_S3_BUCKET_NAME')}.s3.${this.config.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
  }
}
