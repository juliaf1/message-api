import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findOne(id?: string, externalId?: string): Promise<User | null> {
    if (externalId) {
      return this.repository.findByExternalId(externalId);
    } else if (id) {
      return this.repository.findById(id);
    }
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(undefined, userDto.externalId);
    if (existingUser) {
      return existingUser;
    }

    const user: User = User.newInstanceFromDTO(userDto);
    return this.repository.upsertOne(user);
  }
}
