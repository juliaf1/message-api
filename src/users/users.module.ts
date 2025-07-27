import { Module } from '@nestjs/common';
import { DynamoDBService } from '../config/database.config';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [],
  providers: [UsersService, UsersRepository, DynamoDBService],
  exports: [UsersService],
})
export class UsersModule {}
