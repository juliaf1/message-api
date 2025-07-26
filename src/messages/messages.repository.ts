import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../config/database.config';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesRepository {
  private readonly tableName = 'messages';
  private readonly client: DynamoDBClient;

  constructor(private readonly dynamoService: DynamoDBService) {
    this.client = this.dynamoService.getClient();
  }

  async findAll(): Promise<Message[]> {
    const result: Message[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.client.send(command);

    if (response.Items) {
      response.Items.forEach((item) => {
        console.log('Item:', item);
        const message = Message.newInstanceFromDynamoDB(item);
        result.push(message);
      });
    }

    return result;
  }
}
