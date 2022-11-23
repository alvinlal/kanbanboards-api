import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ description: 'email of the user', example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ description: 'password of the account', example: 'pass123' })
  password: string;
}
