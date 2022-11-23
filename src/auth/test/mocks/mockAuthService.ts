import { userStub } from '../../../user/test/stubs/user.stub';

export const mockAuthService = {
  signup: jest.fn().mockResolvedValue({ _id: userStub()._id }),
  validateUser: jest
    .fn()
    .mockResolvedValue({ _id: userStub()._id, password: userStub().password }),
};
