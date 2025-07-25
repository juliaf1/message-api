import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  // TODO: Mover status para um arquivo separado
  // TODO: Iniciar sempre com status 'SENT'
  @IsNotEmpty()
  @IsEnum(['SENT', 'DELIVERED', 'SEEN'], {
    message: 'Valid status required',
  })
  status: 'SENT' | 'DELIVERED' | 'SEEN';
}
