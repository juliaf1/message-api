import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../config/database.config';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly tableName = 'messages'; // DynamoDB single table
  private readonly client: DynamoDBClient;

  constructor(private readonly dynamoService: DynamoDBService) {
    this.client = this.dynamoService.getClient();
  }

  async upsertOne(user: User): Promise<User | null> {
    const itemObject: Record<string, any> = {
      pk: { S: user.getPK() },
      sk: { S: user.getSK() },
      gsi1pk: { S: user.getExternalIdIndexPK() },
      gsi1sk: { S: user.getExternalIdIndexSK() },
      createdAt: { S: user.createdAt.toISOString() },
      updatedAt: { S: new Date().toISOString() },
      userId: { S: user.userId },
      externalId: { S: user.externalId },
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: itemObject,
    });

    const response = await this.client.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      return user;
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        pk: { S: `USER#${id}` },
        sk: { S: `PROFILE` },
      },
    });

    const response = await this.client.send(command);

    if (response.Item) {
      return User.newInstanceFromDynamoDB(response.Item);
    }

    return null;
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': { S: `USER#${externalId}` },
      },
    });

    const response = await this.client.send(command);

    if (response.Items && response.Items.length > 0) {
      return User.newInstanceFromDynamoDB(response.Items[0]);
    }

    return null;
  }
}
