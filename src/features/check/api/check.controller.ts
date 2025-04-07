import {
  Controller,
  Get,
} from '@nestjs/common';
import { DynamoQueryRepository } from '../repository/dynamo.query-repository';


@Controller('check')
export class CheckController {
  constructor(private readonly dynamoRepository: DynamoQueryRepository) {}

  @Get()
  async checkDynamoDb() {
    return await this.dynamoRepository.getAll()
  }
}
