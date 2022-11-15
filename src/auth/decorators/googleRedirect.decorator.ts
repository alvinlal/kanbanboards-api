import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';
import GoogleAuthGuard from '../guards/GoogleAuth.guard';
import SetJwtCookieInterceptor from '../interceptors/SetJwtCookie.interceptor';

export default function googleRedirectDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    UseGuards(GoogleAuthGuard),
    ApiQuery({
      name: 'code',
    }),
    ApiQuery({
      name: 'scope',
    }),
    ApiQuery({
      name: 'authUser',
    }),
    ApiQuery({
      name: 'prompt',
    }),
    ApiResponse({
      status: 301,
      description:
        'redirects to accounts.google.com if required query params are not found',
    }),
    ApiOkResponse({
      description: 'returns object containing unique id of the user',
      schema: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'unique id of the user',
          },
        },
      },
    }),
  );
}
