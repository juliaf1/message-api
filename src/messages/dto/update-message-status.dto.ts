import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';

export class UpdateMessageStatusDto {
  static STATUSES = MessageStatus;
  static TRANSITIONS = {
    [MessageStatus.SENT]: [MessageStatus.DELIVERED],
    [MessageStatus.DELIVERED]: [MessageStatus.SEEN],
    [MessageStatus.SEEN]: [],
  };

  @ApiProperty({
    description: 'Status of the message',
    example: 'SENT',
  })
  @IsNotEmpty()
  @IsEnum(MessageStatus, {
    message: 'Valid status required',
  })
  status: MessageStatus;

  static isValidTransition(
    newStatus: MessageStatus,
    previousStatus?: MessageStatus,
  ): boolean {
    if (!previousStatus) return newStatus === MessageStatus.SENT;
    if (UpdateMessageStatusDto.TRANSITIONS[previousStatus].includes(newStatus))
      return true;
    return false;
  }
}
