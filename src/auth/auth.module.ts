import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import GoogleStrategy from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JwtStrategy from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import LocalStrategy from './strategy/local.strategy';
import { JWT_EXPIRES_IN } from './auth.constants';
import { IsUserExistsConstraint } from '../validators/IsUserExists.validator';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: JWT_EXPIRES_IN },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
    IsUserExistsConstraint,
  ],
})
export class AuthModule {}
