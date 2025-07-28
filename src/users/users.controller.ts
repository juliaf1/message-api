import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import type { Request as ExpressRequest } from 'express';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { DatadogLoggerService } from '../logger/datadog-logger.service';

@UseGuards(AuthGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: DatadogLoggerService,
  ) {}

  @Post() // POST /users
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Request() req: ExpressRequest,
  ) {
    const user: User = req.user;

    // Apenas usuários do sistema podem criar novos usuários
    if (!user.isSystemUser()) {
      throw new ForbiddenException('Unauthorized access to this resource');
    }

    return this.usersService.create(createUserDto);
  }
}
