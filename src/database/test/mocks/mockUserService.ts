import { userStub } from '../../../user/test/stubs/user.stub';

export const mockUserService = {
  validateUser: jest.fn().mockResolvedValue(userStub()),
  createUser: jest.fn().mockResolvedValue(userStub()),
};
