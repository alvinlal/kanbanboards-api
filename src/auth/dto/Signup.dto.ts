import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, NotContains } from 'class-validator';
import { IsUserExists } from '../../validators/IsUserExists.validator';

export class SignupDto {
  @IsEmail({}, { message: 'please enter a valid email' })
  @IsUserExists({ message: 'Account already exists, please login' })
  @ApiProperty({ description: 'email of the user' })
  email: string;

  @MinLength(6, { message: 'password should be atleast 6 characters' })
  @NotContains(' ', {
    message: 'password should not contain spaces',
  })
  @ApiProperty({ description: 'password of the user' })
  password: string;
}
