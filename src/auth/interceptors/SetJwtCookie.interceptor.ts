import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { COOKIE_NAME, COOKIE_MAX_AGE } from '../auth.constants';

@Injectable()
export default class SetJwtCookieInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest<Request>();

    const token = this.jwtService.sign({
      sub: req.user._id,
    });

    context
      .switchToHttp()
      .getResponse<Response>()
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        secure: this.configService.get<string>('ENV') === 'production',
        sameSite:
          this.configService.get<string>('ENV') === 'production'
            ? 'none'
            : 'lax', // TODO:- get a custom domain and change this to strict
      });
    return next.handle();
  }
}
