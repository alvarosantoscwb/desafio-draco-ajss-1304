import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  password!: string;
}
