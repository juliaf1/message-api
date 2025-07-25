import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
  // TODO: Substituir com acesso ao repositório do DynamoDB
  private messages = [
    {
      id: 'uuid-1',
      content: 'Hello!',
      senderId: 'user-uuid-1',
      status: 'SENT',
    },
    {
      id: 'uuid-2',
      content: 'How are you?',
      senderId: 'user-uuid-2',
      status: 'SENT',
    },
    {
      id: 'uuid-3',
      content: 'Good morning.',
      senderId: 'user-uuid-3',
      status: 'DELIVERED',
    },
    {
      id: 'uuid-4',
      content: 'See you soon.',
      senderId: 'user-uuid-4',
      status: 'DELIVERED',
    },
    {
      id: 'uuid-5',
      content: 'Thanks!',
      senderId: 'user-uuid-5',
      status: 'SEEN',
    },
  ];

  findAll(senderId?: string) {
    if (senderId) {
      const messagesArray = this.messages.filter(
        (message) => message.senderId === senderId,
      );
      if (messagesArray.length === 0)
        throw new NotFoundException('Messages Not Found');
      return messagesArray;
    }
    return this.messages;
  }

  findOne(id: string) {
    const message = this.messages.find((message) => message.id === id);

    if (!message) throw new NotFoundException('Message Not Found');

    return message;
  }

  create(createMessageDto: CreateMessageDto) {
    const id: string = uuidv4();

    const newMessage: {
      id: string;
      content: string;
      senderId: string;
      status: string;
    } = {
      id: id,
      ...createMessageDto,
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  updateStatus(id: string, updateMessageStatusDto: UpdateMessageStatusDto) {
    this.messages = this.messages.map((message) => {
      if (message.id === id) {
        return { ...message, ...updateMessageStatusDto };
      }
      return message;
    });

    return this.findOne(id);
  }
}
