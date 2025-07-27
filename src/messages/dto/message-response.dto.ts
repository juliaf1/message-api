import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto extends PartialType(CreateMessageDto) {
  @ApiProperty({
    description: 'UUID of the message',
    example: 'uuid-1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
