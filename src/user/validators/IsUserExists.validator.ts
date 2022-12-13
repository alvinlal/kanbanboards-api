import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { UserRepository } from '../user.repository';

@ValidatorConstraint({ name: 'isEmailExists', async: true })
@Injectable()
export class IsUserExistsConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly userRepository: UserRepository) {}
  async validate(email: string): Promise<boolean> {
    // if this function returns true, then no errors are thrown
    return !!!(await this.userRepository.count({ email }));
  }
}

export function IsUserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExistsConstraint,
    });
  };
}
