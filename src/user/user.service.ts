import { Injectable } from '@nestjs/common';
import { FilterQuery, ProjectionType } from 'mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneUser(
    filter: FilterQuery<UserDocument>,
    projection: ProjectionType<UserDocument>,
  ): Promise<User> {
    return await this.userRepository.findOne(filter, projection);
  }

  async createUser(email: string, password: string | null): Promise<User> {
    return this.userRepository.create({ email, password });
  }

  async userExists(email: string): Promise<boolean> {
    return !!(await this.userRepository.count({ email }));
  }
}
