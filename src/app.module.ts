import { Module } from '@nestjs/common';
import { FileModule } from './features/file/file.module';
import { SqsModule } from './features/sqs/sqs.module';
import { CheckModule } from './features/check/check.module';
import { ConfigModule } from "@nestjs/config";

import configuration from './config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [ '.env'],
    load: [configuration],
  }),
    FileModule, SqsModule, CheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
