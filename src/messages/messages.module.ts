import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { DynamoDBService } from '../config/database.config';
import { DatadogLoggerService } from '../logger/datadog-logger.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesRepository,
    DynamoDBService,
    DatadogLoggerService,
  ],
})
export class MessagesModule {}
