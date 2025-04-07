import { Module } from '@nestjs/common';
import { FileController } from './api/file.controller';
import { S3FileService } from './application/s3-file.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [S3FileService],
})
export class FileModule {}
