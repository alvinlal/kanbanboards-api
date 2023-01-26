import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator';
import { InternalServerErrorResponseDecorator } from '../shared/decorators/InternalServerErrorResponse.decorator';
import { AuthService } from './auth.service';
import { loginDecorators } from './decorators/login.decorator';
import { meDecorators } from './decorators/me.decorator';
import { signupDecorators } from './decorators/signup.decorator';
import { SignupRequestDto } from './dto/request/SignupRequest.dto';
import { MeResponseDto } from './dto/response/MeResponse.dto';
import { SignupResponseDto } from './dto/response/SignupResponse.dto';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/GoogleAuth.guard';
import { googleRedirectDecorators } from './decorators/googleRedirect.decorator';
import { logoutDecorators } from './decorators/logout.decorator';
import { COOKIE_NAME } from './auth.constants';

@Controller('auth')
@ApiTags('auth')
@InternalServerErrorResponseDecorator()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @meDecorators()
  me(@CurrentUser() user: { user_id: string }): MeResponseDto {
    return user;
  }

  @Post('signup')
  @signupDecorators()
  async signup(@Body() body: SignupRequestDto): Promise<SignupResponseDto> {
    return this.authService.signup(body);
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
    //
  }

  @Get('google/redirect')
  @googleRedirectDecorators()
  googleRedirect(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  @logoutDecorators()
  logout(@Res() res: Response) {
    res.clearCookie(COOKIE_NAME);
    return res.json({
      success: true,
    });
  }
}
