import { HttpException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as sharp from 'sharp';

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

  async uploadProfile(file: Express.Multer.File): Promise<string> {
    if (file.mimetype === 'image/svg+xml') {
      throw new HttpException('SVG is not allowed', 400);
    }

    const fileName = `${uuid()}.webp`; // Always save as .webp
    const bucket = this.config.get<string>('AWS_S3_BUCKET_NAME')!;
    const region = this.config.get<string>('AWS_REGION')!;

    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 400, height: 400 })
      .toFormat('webp', { quality: 50 })
      .toBuffer();

    console.log('Uploading to bucket:', bucket);
    console.log('Using region:', region);
    console.log('Saving as:', fileName);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
    });

    await this.s3.send(command);

    return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
  }
}
