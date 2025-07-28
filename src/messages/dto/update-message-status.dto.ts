import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';

export class MessageStatusDto {
  static STATUSES = MessageStatus;
  static TRANSITIONS = {
    [MessageStatus.SENT]: [MessageStatus.DELIVERED],
    [MessageStatus.DELIVERED]: [MessageStatus.SEEN],
    [MessageStatus.SEEN]: [],
  };

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
    if (MessageStatusDto.TRANSITIONS[previousStatus].includes(newStatus))
      return true;
    return false;
  }
}

export class UpdateMessageStatusDto extends PartialType(MessageStatusDto) {}
