import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import GoogleAuthGuard from './guards/GoogleAuth.guard';
import { Request } from 'express';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { SignupDto } from './dto/Signup.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import meDecorators from './decorators/me.decorator';
import InternalServerErrorResponseDecorator from '../decorators/InternalServerErrorResponse.decorator';
import signupDecorators from './decorators/signup.decorator';
import loginDecorators from './decorators/login.decorator';
import googleRedirectDecorators from './decorators/googleRedirect.decorator';

@Controller('auth')
@ApiTags('auth')
@InternalServerErrorResponseDecorator()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @meDecorators()
  me(@CurrentUser() user: { _id: string }) {
    return user;
  }

  @Post('signup')
  @signupDecorators()
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @Post('login')
  @loginDecorators()
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiResponse({
    status: 302,
    description: 'redirects to accounts.google.com',
  })
  google() {
    return { msg: 'Google authentication' };
  }

  @Get('google/redirect')
  @googleRedirectDecorators()
  googleRedirect(@Req() req: Request) {
    return req.user;
  }

  // TODO:- make reusable swagger schema (create new folder) and put userResponse in there
}
