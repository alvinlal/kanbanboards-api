import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true,
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    return new BadRequestException(
      validationErrors.map((error) => {
        delete error.target;
        delete error.children;
        delete error.value;
        return error;
      }),
    );
  },
};
