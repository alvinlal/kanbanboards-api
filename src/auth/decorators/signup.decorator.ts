import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { SignupResponseDto } from '../dto/response/SignupResponse.dto';
import { SetJwtCookieInterceptor } from '../interceptors/SetJwtCookie.interceptor';

export function signupDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    ApiCreatedResponse({
      description: 'returns object containing unique id of the user',
      type: SignupResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'returns 400 if the email and password doesn\t satisfies the constraints',
      schema: {
        example: {
          statusCode: 400,
          message: [
            {
              property: 'email',
              constraints: {
                isUserExists: 'Account already exists, please login',
                isEmail: 'please enter a valid email',
              },
            },
            {
              property: 'password',
              constraints: {
                notContains: 'password should not contain spaces',
                minLength: 'password should be atleast 6 characters',
              },
            },
          ],
          error: 'Bad Request',
        },
      },
    }),
  );
}
