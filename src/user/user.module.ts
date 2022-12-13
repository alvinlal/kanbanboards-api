import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/User.schema';
import { UserRepository } from './user.repository';
import { IsUserExistsConstraint } from './validators/IsUserExists.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, IsUserExistsConstraint],
  exports: [UserService],
})
export class UserModule {}
