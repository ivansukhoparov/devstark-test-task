import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SqsService implements OnModuleInit {
  private sqs: SQSClient;
  private dynamoDb: DynamoDBClient;
  private queueUrl: string;
  private tableName: string;

  constructor(protected readonly config: ConfigService) {
    this.sqs = new SQSClient(config.get<string>('awsConfiguration'));
    this.dynamoDb = new DynamoDBClient(config.get<string>('awsConfiguration'));
    this.queueUrl = config.get<string>('awsQueueUrl');
    this.tableName = config.get<string>('awsDynamoTableName');
  }

  async onModuleInit() {
    this.poll();
  }

  async poll() {
    while (true) {
      const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
      });

      const response = await this.sqs.send(receiveMessageCommand);
      if (response.Messages && response.Messages.length > 0) {
        for (const message of response.Messages) {
          try {
            const data = JSON.parse(message.Body);

            const putItemToDbCommand = new PutItemCommand({
              TableName: this.tableName,
              Item: {
                id: { S: uuidv4() },
                ...Object.fromEntries(
                  Object.entries(data).map(([key, value]) => [
                    key,
                    { S: String(value) },
                  ]),
                ),
              },
            });

            await this.dynamoDb.send(putItemToDbCommand);
            console.log('Saved to DynamoDB:', data);


            const deleteMessageCommand =     new DeleteMessageCommand({
                QueueUrl: this.queueUrl,
                ReceiptHandle: message.ReceiptHandle!,
              })
            await this.sqs.send(deleteMessageCommand);
          } catch (err) {
            console.error('Error handling message:', err);
          }
        }
      }
    }
  }
}
