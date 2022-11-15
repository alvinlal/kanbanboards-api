import {
  applyDecorators,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import LocalAuthGuard from '../guards/LocalAuth.guard';
import SetJwtCookieInterceptor from '../interceptors/SetJwtCookie.interceptor';

export default function loginDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    UseGuards(LocalAuthGuard),
    HttpCode(200),
    ApiBody({
      description: 'email and password of the user',
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'email of the user',
          },
          password: {
            type: 'string',
            description: 'password of the account',
          },
        },
      },
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
    ApiUnauthorizedResponse({
      description:
        'returns 401 on incorrect email or password, or on accounts which were previously signed in with google',
      schema: {
        oneOf: [
          {
            example: {
              oneOf: [
                {
                  statusCode: 401,
                  message: 'incorrect email or password',
                  error: 'Unauthorized',
                },
                {
                  statusCode: 401,
                  message:
                    "This account can only be logged into with Google, or by resetting the password with 'Forgot Password'.",
                  error: 'Unauthorized',
                },
              ],
            },
          },
        ],
      },
    }),
  );
}
