import { AttributeValue } from '@aws-sdk/client-dynamodb';

export class Message {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  static newInstanceFromDynamoDB(
    data: Record<string, AttributeValue>,
  ): Message {
    const message = new Message();
    message.messageId = data.messageId.S;
    message.senderId = data.senderId.S;
    message.content = data.content.S;
    message.createdAt = new Date(data.createdAt.S);
    message.updatedAt = new Date(data.updatedAt.S);
    return message;
  }
}
