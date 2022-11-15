import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import SetJwtCookieInterceptor from '../interceptors/SetJwtCookie.interceptor';

export default function signupDecorators() {
  return applyDecorators(
    UseInterceptors(SetJwtCookieInterceptor),
    ApiCreatedResponse({
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
                IsEmailExists: 'Account already exists, please login',
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
