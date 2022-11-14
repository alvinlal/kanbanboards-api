import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import GoogleAuthGuard from './guards/GoogleAuth.guard';
import { Request } from 'express';
import JwtAuthGuard from './guards/JwtAuth.guard';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { SignupDto } from './dto/Signup.dto';
import SetJwtCookieInterceptor from './interceptors/SetJwtCookie.interceptor';
import LocalAuthGuard from './guards/LocalAuth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: { _id: string }) {
    return user;
  }

  @Post('signup')
  @UseInterceptors(SetJwtCookieInterceptor)
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @Post('login')
  @UseInterceptors(SetJwtCookieInterceptor)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  google() {
    return { msg: 'Google authentication' };
  }

  @Get('google/redirect')
  @UseInterceptors(SetJwtCookieInterceptor)
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req: Request) {
    return req.user;
  }
}
