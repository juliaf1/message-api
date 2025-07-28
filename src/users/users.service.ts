import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findOne(userDto: UserDto): Promise<User | null> {
    return this.repository.findByExternalId(userDto.externalId);
  }

  create(userDto: UserDto): Promise<User> {
    const user: User = User.newInstanceFromDTO(userDto);
    return this.repository.upsertOne(user);
  }
}
