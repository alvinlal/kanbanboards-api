import { Injectable } from '@nestjs/common';
import { User } from '../user/schemas/User.schema';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from './dto/response/SignupResponse.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findOneUser(
      { email },
      { _id: true, password: true },
    );

    if (!user) {
      return null;
    }

    if (user && !user.password) {
      return user;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async signup(data: {
    email: string;
    password: string;
  }): Promise<SignupResponseDto> {
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userService.createUser(data.email, password);
    return { _id: user._id };
  }
}
