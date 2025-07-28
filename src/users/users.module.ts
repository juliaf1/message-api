import { Module } from '@nestjs/common';
import { DynamoDBService } from '../config/database.config';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { DatadogLoggerService } from '../logger/datadog-logger.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    DynamoDBService,
    DatadogLoggerService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
