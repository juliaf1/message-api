import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { DynamoDBService } from '../config/database.config';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository, DynamoDBService],
})
export class MessagesModule {}
