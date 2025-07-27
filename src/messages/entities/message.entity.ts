import { AttributeValue } from '@aws-sdk/client-dynamodb';

export class Message {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'SENT' | 'DELIVERED' | 'SEEN';

  static newInstanceFromDynamoDB(
    data: Record<string, AttributeValue>,
  ): Message {
    const message = new Message();
    message.messageId = data.message_id.S;
    message.senderId = data.sender_id.S;
    message.content = data.content.S;
    message.createdAt = new Date(data.created_at.S);
    message.updatedAt = new Date(data.updated_at.S);
    message.status = data.status.S as 'SENT' | 'DELIVERED' | 'SEEN';
    return message;
  }
}
