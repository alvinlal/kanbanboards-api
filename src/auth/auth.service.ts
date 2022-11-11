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

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return { _id: user._id };
  }
}
