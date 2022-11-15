import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { COOKIE_NAME } from '../auth.constants';
import JwtAuthGuard from '../guards/JwtAuth.guard';

export default function meDecorators() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiCookieAuth(COOKIE_NAME),
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
    ApiUnauthorizedResponse({
      description: 'returns 401 on invalid , empty or expired token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
  );
}
