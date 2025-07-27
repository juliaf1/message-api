import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMessagesDto {
  @ApiProperty({
    description: 'Filter messages by sender ID',
    required: false,
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
  })
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @ApiProperty({
    description: 'Start date for filtering messages',
    example: '2025-07-26',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering messages',
    example: '2025-07-28',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
