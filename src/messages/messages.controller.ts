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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get() // GET /messages or /messages?senderId=value
  findAll(@Query('senderId', ParseUUIDPipe) senderId?: string) {
    return this.messagesService.findAll(senderId);
  }

  @Get(':id') // GET /messages/:id
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.findOne(id);
  }

  @Post() // POST /messages
  create(@Body(ValidationPipe) createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id/status') // PATCH /messages/:id/status
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateMessageStatusDto: UpdateMessageStatusDto,
  ) {
    return this.messagesService.updateStatus(id, updateMessageStatusDto);
  }
}
