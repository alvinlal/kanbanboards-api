import { Repository } from 'typeorm';
import { RepoMock } from '../../../test/types/RepoMock';
import { User } from '../../entities/User.entity';
import { userStub } from '../stubs/user.stub';

export const userRepositoryMock: RepoMock<Repository<User>> = {
  findOne: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn(({ email, password }) =>
    Promise.resolve({ email, password, user_id: userStub().user_id }),
  ),
  count: jest.fn(),
  save: jest.fn(),
};
