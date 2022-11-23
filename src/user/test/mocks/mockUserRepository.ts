import { userStub } from '../stubs/user.stub';

export const mockUserRepository = {
  findOne: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  count: jest.fn().mockResolvedValue(0),
};
