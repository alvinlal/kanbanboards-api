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
import { LoginRequestDto } from '../dto/request/LoginRequest.dto';
import { LoginResponseDto } from '../dto/response/LoginResponse.dto';
import { LocalAuthGuard } from '../guards/LocalAuth.guard';
import { SetJwtCookieInterceptor } from '../interceptors/SetJwtCookie.interceptor';

export function loginDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    UseGuards(LocalAuthGuard),
    HttpCode(200),
    ApiBody({
      description: 'email and password of the user',
      type: LoginRequestDto,
    }),
    ApiOkResponse({
      description: 'returns object containing unique id of the user',
      type: LoginResponseDto,
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
