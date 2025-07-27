import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class MessageStatusDto {
  static STATUSES = {
    SENT: 'SENT',
    DELIVERED: 'DELIVERED',
    SEEN: 'SEEN',
  };
  static TRANSITIONS = {
    [MessageStatusDto.STATUSES.SENT]: [MessageStatusDto.STATUSES.DELIVERED],
    [MessageStatusDto.STATUSES.DELIVERED]: [MessageStatusDto.STATUSES.SEEN],
    [MessageStatusDto.STATUSES.SEEN]: [],
  };

  @IsNotEmpty()
  @IsEnum(Object.values(MessageStatusDto.STATUSES), {
    message: 'Valid status required',
  })
  status: keyof typeof MessageStatusDto.STATUSES;

  static isValidTransition(
    newStatus: string,
    previousStatus?: string,
  ): boolean {
    // Validação para garantir que a transição de status seja válida

    if (!previousStatus) return newStatus === MessageStatusDto.STATUSES.SENT; // Se não houver status anterior, o único status válido é 'SENT'

    if (MessageStatusDto.TRANSITIONS[previousStatus].includes(newStatus))
      return true;

    return false;
  }
}

export class UpdateMessageStatusDto extends PartialType(MessageStatusDto) {}
