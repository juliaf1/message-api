import {
  DynamoDBClient,
  QueryCommand,
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

  async upsertOne(message: Message): Promise<Message | null> {
    const itemObject: Record<string, any> = {
      pk: { S: message.getPK() },
      sk: { S: message.getSK() },
      gsi1pk: { S: message.getSenderIndexPK() },
      gsi1sk: { S: message.getSenderIndexSK() },
      gsi2pk: { S: message.getMessageIndexPK() },
      gsi2sk: { S: message.getMessageIndexSK() },
      content: { S: message.content },
      message_id: { S: message.messageId },
      sender_id: { S: message.senderId },
      recipient_phone_number: { S: message.recipientPhoneNumber },
      created_at: { S: message.createdAt.toISOString() },
      updated_at: { S: new Date().toISOString() },
      status: { S: message.status },
      sent_at: message.sentAt ? { S: message.sentAt.toISOString() } : undefined,
      delivered_at: message.deliveredAt
        ? { S: message.deliveredAt.toISOString() }
        : undefined,
      seen_at: message.seenAt ? { S: message.seenAt.toISOString() } : undefined,
    };

    // Remove keys with undefined values (simpler way)
    const filteredItemObject = Object.fromEntries(
      Object.entries(itemObject).filter(([_, v]) => v !== undefined),
    );

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: filteredItemObject,
    });

    const response = await this.client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      return message;
    }
    return null;
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
      return Message.newInstanceFromDynamoDB(response.Items[0]);
    }

    return null;
  }

  async findBySenderId(
    senderId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Message[]> {
    const startTimestamp = startDate ? startDate.getTime() : 0;
    // Use end of the day for endDate
    const endTimestamp = endDate
      ? new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
          999,
        ).getTime()
      : Date.now();

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
      return this.mapItemsToMessages(response.Items);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Message[]> {
    // Gera datas entre startDate e endDate
    const dates = this.generateDates(startDate, endDate);

    // Cria uma lista de promessas para consultar cada data
    const queryPromises = dates.map((date) => {
      const params = {
        TableName: this.tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `MESSAGE#${date}` },
        },
      };

      return this.client.send(new QueryCommand(params));
    });

    try {
      const results = await Promise.all(queryPromises);

      // Mapeia os resultados para instâncias de Message
      // e achata o array de resultados
      return results.flatMap((result) =>
        this.mapItemsToMessages(result.Items || []),
      );
    } catch (error) {
      console.error('Error querying messages:', error);
      throw error;
    }
  }

  generateDates(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  mapItemsToMessages(items: Record<string, any>[]): Message[] {
    return items.map((item) => Message.newInstanceFromDynamoDB(item));
  }
}
