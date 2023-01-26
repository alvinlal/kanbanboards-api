import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GoogleRedirectRequestDto } from '../dto/request/GoogleRedirectRequest.dto';
import { GoogleRedirectResponseDto } from '../dto/response/GoogleRedirectResponse.dto';
import { GoogleAuthGuard } from '../guards/GoogleAuth.guard';
import { SetJwtCookieInterceptor } from '../interceptors/SetJwtCookie.interceptor';

export function googleRedirectDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    UseGuards(GoogleAuthGuard),
    ApiQuery({
      type: GoogleRedirectRequestDto,
    }),
    ApiOkResponse({
      description: 'returns object containing unique id of the user',
      type: GoogleRedirectResponseDto,
    }),
  );
}
