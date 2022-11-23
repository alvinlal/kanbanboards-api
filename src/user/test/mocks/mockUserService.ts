import { userStub } from '../stubs/user.stub';

export const mockUserService = {
  findOneUser: jest.fn().mockResolvedValue(userStub()),

  createUser: jest.fn().mockResolvedValue(userStub()),

  userExists: jest.fn().mockResolvedValue(true),
};
