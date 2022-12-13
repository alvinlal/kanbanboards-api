import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { COOKIE_NAME } from '../auth.constants';
import { LogoutResponseDto } from '../dto/response/LogoutResponse.dto';

export function logoutDecorators() {
  return applyDecorators(
    ApiOkResponse({
      description: `removes ${COOKIE_NAME} cookie `,
      type: LogoutResponseDto,
    }),
  );
}
