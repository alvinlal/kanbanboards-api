import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.userService.findOne(
      { email: profile._json.email },
      { user_id: true },
    );
    if (user) return done(null, { user_id: user.user_id });
    const newUser = await this.userService.createUser(
      profile._json.email,
      null,
    );
    return done(null, { user_id: newUser.user_id });
  }
}
