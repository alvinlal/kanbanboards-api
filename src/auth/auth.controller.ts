import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/GoogleAuth.guard';
import { Request, Response } from 'express';
import { CurrentUser } from '../user/decorators/CurrentUser.decorator';
import { SignupRequestDto } from './dto/request/SignupRequest.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { meDecorators } from './decorators/me.decorator';
import { InternalServerErrorResponseDecorator } from '../decorators/InternalServerErrorResponse.decorator';
import { signupDecorators } from './decorators/signup.decorator';
import { loginDecorators } from './decorators/login.decorator';
import { googleRedirectDecorators } from './decorators/googleRedirect.decorator';
import { SignupResponseDto } from './dto/response/SignupResponse.dto';
import { MeResponseDto } from './dto/response/MeResponse.dto';
import { COOKIE_NAME } from './auth.constants';
import { logoutDecorators } from './decorators/logout.decorator';

@Controller('auth')
@ApiTags('auth')
@InternalServerErrorResponseDecorator()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @meDecorators()
  me(@CurrentUser() user: { _id: string }): MeResponseDto {
    return user;
  }

  @Post('signup')
  @signupDecorators()
  async signup(@Body() body: SignupRequestDto): Promise<SignupResponseDto> {
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
