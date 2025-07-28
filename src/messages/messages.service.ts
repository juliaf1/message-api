import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  MessageStatusDto,
  UpdateMessageStatusDto,
} from './dto/update-message-status.dto';
import { FindMessagesDto } from './dto/find-messages.dto';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly repository: MessagesRepository) {}

  findAll(query: FindMessagesDto) {
    const { senderId } = query;
    let { startDate, endDate } = query;

    // Se nenhum dos parâmetros for passado, retornar erro
    if (!senderId && !startDate && !endDate) {
      throw new BadRequestException('At least one parameter must be provided');
    }

    // Se range de data for maior que 4 dias, retornar erro
    if (
      startDate &&
      endDate &&
      endDate.getTime() - startDate.getTime() > 4 * 24 * 60 * 60 * 1000
    ) {
      throw new BadRequestException('Date range cannot be greater than 4 days');
    }

    // Se startDate e endDate não forem passados, buscar por últimos 4 dias
    if (!startDate && !endDate) {
      const now = new Date();
      startDate = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
      endDate = now;
    }

    if (senderId) {
      return this.repository.findBySenderId(senderId, startDate, endDate);
    }

    return this.repository.findByDateRange(startDate, endDate);
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

    message.updateStatus(updateMessageStatusDto.status);
    return await this.repository.upsertOne(message);
  }
}
