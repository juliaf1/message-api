import { AttributeValue } from '@aws-sdk/client-dynamodb';

export class MessageStatus {
  messageId: string;
  status: 'SENT' | 'DELIVERED' | 'SEEN';
  createdAt: Date;
  updatedAt: Date;
  sentAt: Date | null;
  deliveredAt: Date | null;
  seenAt: Date | null;

  static newInstanceFromDynamoDB(
    data: Record<string, AttributeValue>,
  ): MessageStatus {
    const message = new MessageStatus();
    message.messageId = data.message_id.S;
    message.status = data.status.S as 'SENT' | 'DELIVERED' | 'SEEN';
    message.createdAt = new Date(data.created_at.S);
    message.updatedAt = new Date(data.updated_at.S);
    message.sentAt = data.sent_at ? new Date(data.sent_at.S) : null;
    message.deliveredAt = data.delivered_at
      ? new Date(data.delivered_at.S)
      : null;
    message.seenAt = data.seen_at ? new Date(data.seen_at.S) : null;
    return message;
  }
}
