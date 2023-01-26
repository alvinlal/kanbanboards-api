import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'unique id of the user',
    example: '31072f96-8b81-4830-b568-d2c5fdf7ca23',
  })
  user_id: string;
}
