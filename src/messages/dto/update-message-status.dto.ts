import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class UpdateMessageStatusDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  // TODO: Mover status para um arquivo separado
  // TODO: Validar troca de status (sent -> delivered -> seen)
  @IsNotEmpty()
  @IsEnum(['SENT', 'DELIVERED', 'SEEN'], {
    message: 'Valid status required',
  })
  status: 'SENT' | 'DELIVERED' | 'SEEN';
}
