import { ApiProperty } from '@nestjs/swagger';
export class GoogleRedirectRequestDto {
  @ApiProperty({
    description:
      'provided by google as query params after redirecting to the callback url',
  })
  code: string;

  @ApiProperty({
    description:
      'provided by google as query params after redirecting to the callback url',
  })
  scope: string;

  @ApiProperty({
    description:
      'provided by google as query params after redirecting to the callback url',
  })
  authUser: string;

  @ApiProperty({
    description:
      'provided by google as query params after redirecting to the callback url',
  })
  prompt: string;
}
