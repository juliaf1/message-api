import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  MessageStatusDto,
  UpdateMessageStatusDto,
} from './dto/update-message-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly repository: MessagesRepository) {}

  private messages = [
    {
      id: '90f81cec-c915-4940-b648-bd263053722c',
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
    console.log(senderId);
    return this.repository.findAll();
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
      status: 'SENT';
    } = {
      id: id,
      ...createMessageDto,
      status: 'SENT',
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  updateStatus(id: string, updateMessageStatusDto: UpdateMessageStatusDto) {
    // Buscar mensagem pelo ID
    const message = this.findOne(id);
    if (!message) throw new NotFoundException('Message Not Found');

    // Validar transição de status
    if (
      !MessageStatusDto.isValidTransition(
        updateMessageStatusDto.status,
        message.status,
      )
    ) {
      throw new BadRequestException(
        `Invalid status transition from ${message.status} to ${updateMessageStatusDto.status}`,
      );
    }

    // TODO: Salvar no "banco"
    this.messages = this.messages.map((message) => {
      if (message.id === id) {
        return { ...message, ...updateMessageStatusDto };
      }
      return message;
    });

    // TODO: Retornar DTO de mensagem atualizada
    return this.findOne(id);
  }
}
