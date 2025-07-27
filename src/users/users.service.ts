import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findOne(id?: string, userDto?: UserDto): Promise<User | null> {
    if (id) {
      return this.repository.findById(id);
    }
    if (userDto) {
      return this.repository.findByExternalId(userDto.externalId);
    }
    return null;
  }

  create(userDto: UserDto) {
    const user: User = User.newInstanceFromDTO(userDto);
    return this.repository.upsertOne(user);
  }
}
