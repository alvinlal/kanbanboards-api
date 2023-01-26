import { Test } from '@nestjs/testing';
import { mockUserService } from '../../../user/test/mock/userService.mock';
import { userStub } from '../../../user/test/stubs/user.stub';
import { UserService } from '../../../user/user.service';
import { AuthService } from '../../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const { email, password, user_id } = userStub();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser()', () => {
    it('should call userService.findOne()', async () => {
      await authService.validateUser(email, password);
      expect(mockUserService.findOne).toHaveBeenCalledWith(
        { email },
        { user_id: true, password: true },
      );
    });

    it("should return null if user doesn't exists", async () => {
      mockUserService.findOne.mockResolvedValueOnce(null);
      const user = await authService.validateUser(email, password);
      expect(user).toBe(null);
    });

    it("should return null if password doesn't match", async () => {
      mockUserService.findOne.mockResolvedValueOnce({
        user_id,
        password:
          '$2b$10$yHYP3FhV6piMRXs4R1v99.b2032t9JHl8OHMeVd3bKeK8gbgr551u',
      });
      const user = await authService.validateUser(email, 'pass');
      expect(user).toEqual(null);
    });

    it("should return user object with password null if the user hasn't set a password (sign up with google)", async () => {
      mockUserService.findOne.mockResolvedValueOnce({
        user_id,
        password: null,
      });
      const user = await authService.validateUser(email, null);
      expect(user).toEqual({
        user_id,
        password: null,
      });
    });

    it('should return user object if password is correct', async () => {
      mockUserService.findOne.mockResolvedValueOnce({
        user_id,
        password:
          '$2b$10$yHYP3FhV6piMRXs4R1v99.b2032t9JHl8OHMeVd3bKeK8gbgr551u',
      });
      const user = await authService.validateUser(email, '123456');
      expect(user).toEqual({
        user_id,
        password:
          '$2b$10$yHYP3FhV6piMRXs4R1v99.b2032t9JHl8OHMeVd3bKeK8gbgr551u',
      });
    });
  });

  describe('signup()', () => {
    it('should call userService.createUser()', async () => {
      mockUserService.createUser.mockResolvedValueOnce({
        user_id,
      });
      await authService.signup({ email, password });
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        email,
        expect.any(String),
      );
    });

    it('should return object with user_id', async () => {
      const newUser = await authService.signup({ email, password });
      expect(newUser).toEqual({ user_id });
    });
  });
});
