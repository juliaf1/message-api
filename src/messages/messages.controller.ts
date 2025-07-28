import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { FindMessagesDto } from './dto/find-messages.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request as ExpressRequest } from 'express';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard)
@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get() // GET /messages or /messages?senderId=value
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: FindMessagesDto,
    @Request() req: ExpressRequest,
  ) {
    const user: User = req.user;

    // Se não for usuário do sistema, filtrar por senderId
    if (!user.isSystemUser()) {
      query.senderId = user.userId;
    }

    return this.messagesService.findAll(query);
  }

  @Get(':id') // GET /messages/:id
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest,
  ) {
    const user: User = req.user;
    const message = await this.messagesService.findOne(id);

    // Se não for usuário do sistema, verificar se é dono da mensagem
    if (!user.isSystemUser() && !message.belongsToUser(user.userId)) {
      throw new ForbiddenException('Unauthorized access to this message');
    }

    return message;
  }

  @Post() // POST /messages
  create(
    @Body(ValidationPipe) createMessageDto: CreateMessageDto,
    @Request() req: ExpressRequest,
  ) {
    const user: User = req.user;

    // Se não for usuário do sistema, definir senderId como externalId do usuário
    if (!user.isSystemUser()) {
      createMessageDto.senderId = user.userId;
    }

    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id/status') // PATCH /messages/:id/status
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateMessageStatusDto: UpdateMessageStatusDto,
    @Request() req: ExpressRequest,
  ) {
    const user: User = req.user;
    const message = await this.messagesService.findOne(id);

    // Se não for usuário do sistema, verificar se é dono da mensagem
    if (!user.isSystemUser() && !message.belongsToUser(user.userId)) {
      throw new ForbiddenException(
        'Unauthorized access to update this message',
      );
    }

    return this.messagesService.updateStatus(message, updateMessageStatusDto);
  }
}
