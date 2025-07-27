import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { CreateMessageDto } from '../dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';

enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  SEEN = 'SEEN',
}

export class Message {
  messageId: string;
  senderId: string;
  recipientPhoneNumber: string;

  content: string;
  mediaUrl?: string;
  mediaType?: string;

  createdAt: Date;
  updatedAt: Date;

  status: MessageStatus;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  seenAt?: Date | null;

  getPK(): string {
    return `MESSAGE#${this.createdAt.toISOString().split('T')[0]}`;
  }

  getSK(): string {
    return `MESSAGE#${this.createdAt.getTime()}#${this.messageId}`;
  }

  getSenderIndexPK(): string {
    return `SENDER#${this.senderId}`;
  }

  getSenderIndexSK(): string {
    return `MESSAGE#${this.createdAt.getTime()}#${this.messageId}`;
  }

  getMessageIndexPK(): string {
    return `MESSAGE#${this.messageId}`;
  }

  getMessageIndexSK(): string {
    return `MESSAGE#${this.messageId}`;
  }

  updateStatus(status: MessageStatus): void {
    this.status = status;
    this.updatedAt = new Date();

    if (status === MessageStatus.SENT) {
      this.sentAt = this.updatedAt;
    } else if (status === MessageStatus.DELIVERED) {
      this.deliveredAt = this.updatedAt;
    } else if (status === MessageStatus.SEEN) {
      this.seenAt = this.updatedAt;
    }
  }

  static newInstanceFromDTO(data: CreateMessageDto): Message {
    const id: string = uuidv4();
    const time = new Date();
    const message = new Message();

    message.messageId = id;
    message.senderId = data.senderId;
    message.recipientPhoneNumber = data.recipientPhoneNumber;
    message.content = data.content;
    message.createdAt = time;
    message.updatedAt = time;
    message.status = MessageStatus.SENT;

    return message;
  }

  static newInstanceFromDynamoDB(
    data: Record<string, AttributeValue>,
  ): Message {
    const message = new Message();
    message.messageId = data.message_id.S;
    message.senderId = data.sender_id.S;
    message.content = data.content.S;
    message.createdAt = new Date(data.created_at.S);
    message.updatedAt = new Date(data.updated_at.S);
    message.status = data.status.S as MessageStatus;
    message.recipientPhoneNumber = data.recipient_phone_number.S;
    return message;
  }
}
