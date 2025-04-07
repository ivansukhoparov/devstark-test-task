import { Module } from '@nestjs/common';
import { CheckController } from './api/check.controller';
import { DynamoQueryRepository } from './repository/dynamo.query-repository';

@Module({
  imports: [],
  controllers: [CheckController],
  providers: [DynamoQueryRepository],
})
export class CheckModule {}
