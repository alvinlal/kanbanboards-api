import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'unique id of the user',
    example: '636209bd25ca4b455091a4b0',
  })
  _id: string;
}
