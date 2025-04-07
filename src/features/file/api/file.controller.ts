import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3FileService } from '../application/s3-file.service';
import { Express, Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: S3FileService) {}

  @Get()
  async fileUploadPage(@Res() res: Response) {
    res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Upload CSV</title>
          </head>
          <body>
          <h1>Upload CSV File</h1>
          <form action="http://localhost:3000/file" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" accept=".csv" required />
            <button type="submit">Upload</button>
          </form>
          </body>
          </html>
`);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileKey = await this.fileService.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      fileKey,
    };
  }
}
