import { userStub } from '../stubs/user.stub';

export const mockUserService = {
  findOne: jest.fn(),
  createUser: jest.fn().mockResolvedValue({
    user_id: userStub().user_id,
  }),
  userExists: jest.fn(),
};
