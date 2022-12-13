import { Test } from '@nestjs/testing';
import { mockUserService } from '../../../user/test/mocks/mockUserService';
import { userStub } from '../../../user/test/stubs/user.stub';
import { UserService } from '../../../user/user.service';
import { AuthService } from '../../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser()', () => {
    it('should call userService.findOneUser', async () => {
      await authService.validateUser(userStub().email, userStub().password);
      expect(userService.findOneUser).toHaveBeenCalledWith(
        {
          email: userStub().email,
        },
        { _id: true, password: true },
      );
    });

    it("should return null if user doesn't exists", async () => {
      jest
        .spyOn(userService, 'findOneUser')
        .mockImplementationOnce(() => Promise.resolve(null));
      expect(
        await authService.validateUser(userStub().email, userStub().password),
      ).toBe(null);
    });

    it("should return user object if the user hasn't set a password (sign up with google)", async () => {
      jest.spyOn(userService, 'findOneUser').mockImplementationOnce(() =>
        Promise.resolve({
          _id: userStub()._id,
          email: userStub().email,
          password: null,
        }),
      );

      expect(
        await authService.validateUser(userStub().email, userStub().password),
      ).toStrictEqual({
        _id: userStub()._id,
        email: userStub().email,
        password: null,
      });
    });

    it('should return null on incorrect password', async () => {
      expect(
        await authService.validateUser(userStub().email, userStub().password),
      ).toEqual(null);
    });
  });

  describe('signup()', () => {
    it('should call userService.createUser', async () => {
      await authService.signup({
        email: userStub().email,
        password: userStub().password,
      });
      expect(userService.createUser).toHaveBeenCalledWith(
        userStub().email,
        expect.any(String),
      );
    });

    it('should return an object with _id in it', async () => {
      expect(
        await authService.signup({
          email: userStub().email,
          password: userStub().password,
        }),
      ).toEqual({ _id: userStub()._id });
    });
  });
});
