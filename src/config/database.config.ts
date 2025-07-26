import { Injectable } from '@nestjs/common';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBClient;

  constructor() {
    const config: DynamoDBClientConfig = {
      region: process.env.AWS_REGION || 'us-west-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'user',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'pass',
      },
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    };

    this.client = new DynamoDBClient(config);
  }

  public getClient(): DynamoDBClient {
    return this.client;
  }
}
