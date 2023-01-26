import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../user/test/stubs/user.stub';
import { AuthService } from '../../auth.service';
import { LocalStrategy } from '../../strategy/local.strategy';
import { mockAuthService } from '../mocks/authService.mock';

// TODO:- avoid nesting and mutable vars during tests for better maintainable and readable testbase, https://kentcdodds.com/blog/avoid-nesting-when-youre-testing

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  const { email, password, user_id } = userStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, LocalStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('validate()', () => {
    it('should call authService.validateUser()', async () => {
      await localStrategy.validate(email, password);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should throw UnauthorizedException on incorrect credentials', async () => {
      mockAuthService.validateUser.mockResolvedValueOnce(null);
      await expect(localStrategy.validate(email, password)).rejects.toEqual(
        new UnauthorizedException('incorrect email or password'),
      );
    });

    it('should throw UnauthorizedException on accounts created using google (password is null)', async () => {
      mockAuthService.validateUser.mockResolvedValueOnce({
        email,
        password: null,
      });
      await expect(localStrategy.validate(email, password)).rejects.toEqual(
        new UnauthorizedException(
          "This account can only be logged into with Google, or by resetting the password with 'Forgot Password'.",
        ),
      );
    });

    it('should return an object with user_id in it on valid credentials', async () => {
      expect(await localStrategy.validate(email, password)).toEqual({
        user_id,
      });
    });
  });
});
