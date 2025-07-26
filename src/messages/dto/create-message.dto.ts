import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { MessageStatusDto } from './update-message-status.dto';

export class CreateMessageDto extends PartialType(MessageStatusDto) {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, World!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the sender',
    example: 'e1f3c2d4-5b6a-7c8d-9e0f-1a2b3c4d5e6f',
  })
  @IsString()
  @IsNotEmpty()
  senderId: string;
}
