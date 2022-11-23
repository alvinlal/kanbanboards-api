import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'isEmailExists', async: true })
@Injectable()
export class IsUserExistsConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}
  async validate(email: string): Promise<boolean> {
    // TODO call userRepository.count directly
    // if this function returns true, then no errors are thrown
    return !(await this.userService.userExists(email));
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
