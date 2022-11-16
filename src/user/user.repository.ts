import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EntityRepository from '../database/entity.repository';
import { User, UserDocument } from './schemas/User.schema';

export default class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
