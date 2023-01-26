import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from 'class-validator';
import { UserService } from '../../user/user.service';

@ValidatorConstraint({ name: 'isUserExists', async: true })
@Injectable()
export class IsUserExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}
  async validate(email: string): Promise<boolean> {
    // if this function returns true, then no errors are thrown
    return !!!(await this.userService.userExists(email));
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
