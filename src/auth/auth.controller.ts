import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import GoogleAuthGuard from './guards/GoogleAuth.guard';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import JwtAuthGuard from './guards/JwtAuth.guard';
import { CurrentUser } from '../decorators/CurrentUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { _id: string }) {
    return user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  google() {
    return { msg: 'Google authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleRedirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const jwtToken = this.jwtService.sign({
      sub: req.user._id,
    });

    res.cookie('ACCESS_TOKEN', jwtToken, {
      httpOnly: true,
      maxAge: 2160000000,
      secure: this.configService.get<string>('ENV') === 'production',
      sameSite: 'none',
    });

    return req.user;
  }
}
