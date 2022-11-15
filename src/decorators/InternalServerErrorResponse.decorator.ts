import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export default () =>
  ApiInternalServerErrorResponse({
    description: 'returns 500 on any server errors',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  });
