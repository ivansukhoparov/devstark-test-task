import { Injectable } from "@nestjs/common";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DynamoQueryRepository {
  private dynamoDb: DynamoDBClient;
  private tableName: string;

  constructor(protected readonly config: ConfigService) {
    this.dynamoDb = new DynamoDBClient(config.get<string>("awsConfiguration"));
    this.tableName = config.get<string>("awsDynamoTableName");
  }

  async getAll() {
    const getAllCommand = new ScanCommand({
      TableName: this.tableName
    });

    const data = await this.dynamoDb.send(getAllCommand);
    return data.Items;
  }
}
