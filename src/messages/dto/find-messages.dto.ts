import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

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
    example: '2023-10-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering messages',
    example: '2023-10-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
