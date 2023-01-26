import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable({})
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(
    email: string,
    password: string,
  ): Promise<{ user_id: string }> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('incorrect email or password');
    }
    if (user && !user.password) {
      throw new UnauthorizedException(
        "This account can only be logged into with Google, or by resetting the password with 'Forgot Password'.",
      );
    }
    return { user_id: user.user_id };
  }
}
