import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, MinLength, NotContains } from 'class-validator';
import { IsUserExists } from '../../validators/IsUserExists.validator';

export class SignupDto {
  @IsEmail({}, { message: 'please enter a valid email' })
  @IsUserExists({ message: 'Account already exists, please login' })
  email: string;

  @MinLength(6, { message: 'password should be atleast 6 characters' })
  @NotContains(' ', {
    message: 'password should not contain spaces',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
