import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../dto/user.dto';

export class User {
  userId: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date;

  getPK(): string {
    return `USER#${this.userId}`;
  }

  getSK(): string {
    return `PROFILE`;
  }

  getExternalIdIndexPK(): string {
    return `USER#${this.externalId}`;
  }

  getExternalIdIndexSK(): string {
    return `USER#${this.userId}`;
  }

  static newInstanceFromDTO(data: UserDto): User {
    const user = new User();
    user.userId = uuidv4();
    user.externalId = data.externalId;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  static newInstanceFromDynamoDB(data: Record<string, AttributeValue>): User {
    const user = new User();
    user.userId = data.user_id.S;
    user.externalId = data.external_id.S;
    user.createdAt = new Date(data.created_at.S);
    user.updatedAt = new Date(data.updated_at.S);
    return user;
  }
}
