import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDB;

  constructor() {
    this.client = new DynamoDB({
      region: process.env.AWS_REGION || 'us-west-2',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'user',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'pass',
    });
  }

  getClient(): DynamoDB {
    return this.client;
  }
}
