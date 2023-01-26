import { userStub } from '../../../user/test/stubs/user.stub';

export const mockAuthService = {
  signup: jest.fn().mockResolvedValue({ user_id: userStub().user_id }),
  validateUser: jest.fn().mockResolvedValue({
    user_id: userStub().user_id,
    password: userStub().password,
  }),
};
