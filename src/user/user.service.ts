import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { User, UserDocument } from './schemas/User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(
    filter: FilterQuery<UserDocument>,
    projection: ProjectionType<UserDocument> = {
      _id: true,
      email: true,
      password: true,
    },
  ): Promise<UserDocument> {
    return await this.userModel.findOne(filter, projection);
  }

  async create(
    email: string,
    password: string | null,
  ): Promise<Partial<UserDocument>> {
    const newUser = new this.userModel({ email, password });
    return await newUser.save();
  }

  async userExists(email: string): Promise<boolean> {
    return !!(await this.userModel.count({ email }));
  }
}
