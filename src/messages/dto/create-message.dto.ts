import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, World!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  content: string;

  @ApiProperty({
    description: 'ID of the sender',
    example: 'e1f3c2d4-5b6a-7c8d-9e0f-1a2b3c4d5e6f',
  })
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({
    description: 'Commercial phone number of the recipient',
    example: '40043000',
  })
  @IsString()
  @IsNotEmpty()
  recipientPhoneNumber: string;
}
