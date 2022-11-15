import { Injectable } from '@nestjs/common';
import { UserDocument } from '../user/schemas/User.schema';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserDocument> | null> {
    const user = await this.userService.findOne(
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
  }): Promise<{ _id: string }> {
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create(data.email, password);
    return { _id: user._id };
  }
}
