import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { CreateMessageDto } from '../dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';

export class Message {
  messageId: string;
  senderId: string;
  recipientPhoneNumber: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'SENT' | 'DELIVERED' | 'SEEN';

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
    message.status = 'SENT';

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
    message.status = data.status.S as 'SENT' | 'DELIVERED' | 'SEEN';
    message.recipientPhoneNumber = data.recipient_phone_number.S;
    return message;
  }
}
