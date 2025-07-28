import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'juliafrederico@usp.br',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
