import {
  DynamoDBClient,
  QueryCommand,
  GetItemCommand,
  BatchGetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
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

  async upsertOne(message: Message): Promise<void> {
    const itemObject: Record<string, any> = {
      pk: { S: message.get_pk() },
      sk: { S: message.get_sk() },
      gsi1pk: { S: message.get_sender_index_pk() },
      gsi1sk: { S: message.get_sender_index_sk() },
      gsi2pk: { S: message.get_message_index_pk() },
      gsi2sk: { S: message.get_message_index_sk() },
      content: { S: message.content },
      message_id: { S: message.messageId },
      sender_id: { S: message.senderId },
      recipient_phone_number: { S: message.recipientPhoneNumber },
      created_at: { S: message.createdAt.toISOString() },
      updated_at: { S: message.updatedAt.toISOString() },
      status: { S: message.status },
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: itemObject,
    });

    await this.client.send(command);
  }

  async findById(id: string): Promise<Message | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'gsi2',
      KeyConditionExpression: 'gsi2pk = :gsi2pk',
      ExpressionAttributeValues: {
        ':gsi2pk': { S: `MESSAGE#${id}` },
      },
      Limit: 1,
    });

    const response = await this.client.send(command);

    if (response.Items && response.Items.length > 0) {
      console.log('Item:', response.Items[0]);
      return Message.newInstanceFromDynamoDB(response.Items[0]);
    }

    return null;
  }

  generateDates(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  async findBySenderId(
    senderId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Message[]> {
    const result: Message[] = [];

    const startTimestamp = startDate ? startDate.getTime() : 0;
    const endTimestamp = endDate ? endDate.getTime() : Date.now();

    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'gsi1',
      KeyConditionExpression:
        'gsi1pk = :pk AND gsi1sk BETWEEN :startSK AND :endSK',
      ExpressionAttributeValues: {
        ':pk': { S: `SENDER#${senderId}` },
        ':startSK': { S: `MESSAGE#${startTimestamp}` },
        ':endSK': { S: `MESSAGE#${endTimestamp}` },
      },
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

  async findByDateRange(startDate: Date, endDate: Date): Promise<Message[]> {
    const result: Message[] = [];

    // PK is MESSAGE#2025-07-27
    // SK is MESSAGE#1753575755582#70a35e02-3f73-4340-bca4-9d975815cfd6

    // Gera datas entre startDate e endDate
    const dates = this.generateDates(startDate, endDate);

    // BatchGetItem para buscar mensagens por data
    const keys = dates.map((date: Date) => ({
      PK: { S: `MESSAGE#${date.toISOString().split('T')[0]}` },
    }));

    const command = new BatchGetItemCommand({
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    });

    const response = await this.client.send(command);

    if (response.Responses && response.Responses[this.tableName]) {
      response.Responses[this.tableName].forEach((item) => {
        const message = Message.newInstanceFromDynamoDB(item);
        result.push(message);
      });
    }

    return result;
  }
}
