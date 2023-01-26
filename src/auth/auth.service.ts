import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from './dto/response/SignupResponse.dto';
import { User } from '../user/entities/User.entity';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(
      { email },
      { user_id: true, password: true },
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
    const { user_id } = await this.userService.createUser(data.email, password);
    return { user_id };
  }
}
