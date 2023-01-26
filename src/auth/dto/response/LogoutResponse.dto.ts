import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'boolean indicating whether the logout was successfull or not',
  })
  success: true;
}
