import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(
    where: FindOptionsWhere<User>,
    select: FindOptionsSelect<User>,
  ) {
    return await this.userRepository.findOne({ where, select });
  }

  async createUser(
    email: string,
    password: string | null,
  ): Promise<{ user_id: string }> {
    const newUser = await this.userRepository.create({ email, password });
    await this.userRepository.save(newUser);
    return { user_id: newUser.user_id };
  }

  async userExists(email: string): Promise<boolean> {
    return !!(await this.userRepository.count({ where: { email } }));
  }
}
