import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  MessageStatusDto,
  UpdateMessageStatusDto,
} from './dto/update-message-status.dto';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly repository: MessagesRepository) {}

  findAll(senderId?: string) {
    console.log(senderId);
    return this.repository.findBySenderId(senderId, new Date(), new Date());
  }

  findOne(id: string) {
    console.log(id);
    return this.repository.findById(id);
  }

  create(createMessageDto: CreateMessageDto) {
    const message: Message = Message.newInstanceFromDTO(createMessageDto);
    return this.repository.upsertOne(message);
  }

  async updateStatus(
    id: string,
    updateMessageStatusDto: UpdateMessageStatusDto,
  ) {
    // Buscar mensagem pelo ID
    const message = await this.repository.findById(id);

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

    message.status = updateMessageStatusDto.status;
    return await this.repository.upsertOne(message);
  }
}
