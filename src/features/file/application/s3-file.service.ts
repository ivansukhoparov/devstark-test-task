import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as process from 'process';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3FileService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(protected readonly config: ConfigService) {
    this.s3Client = new S3Client(config.get<string>('awsConfiguration'));
    this.bucketName = config.get<string>('awsS3BucketName')
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileKey = `${uuidv4()}-${file.originalname}`;
    const uploadFileCommand: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(uploadFileCommand);

    return fileKey;
  }
}
