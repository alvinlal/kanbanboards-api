import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { userStub } from '../../../user/test/stubs/user.stub';
import { AuthService } from '../../auth.service';
import { LocalStrategy } from '../../strategy/local.strategy';
import { mockAuthService } from '../mocks/mockAuthService';

// TODO:- avoid nesting and mutable vars during tests for better maintainable and readable testbase, https://kentcdodds.com/blog/avoid-nesting-when-youre-testing

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

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

  describe('validate', () => {
    describe('when validate is called', () => {
      test('it should call authService.validateUser', async () => {
        await localStrategy.validate(userStub().email, userStub().password);

        expect(authService.validateUser).toHaveBeenCalledWith(
          userStub().email,
          userStub().password,
        );
      });

      test('it should throw UnauthorizedException on incorrect email or password', async () => {
        jest
          .spyOn(authService, 'validateUser')
          .mockImplementationOnce(() => Promise.resolve(null));

        await expect(
          localStrategy.validate(userStub().email, userStub().password),
        ).rejects.toEqual(
          new UnauthorizedException('incorrect email or password'),
        );
      });

      test('it should throw UnauthorizedException on accounts created using google', async () => {
        jest.spyOn(authService, 'validateUser').mockImplementationOnce(() =>
          Promise.resolve({
            email: userStub().email,
            password: null,
          }),
        );

        await expect(
          localStrategy.validate(userStub().email, userStub().password),
        ).rejects.toEqual(
          new UnauthorizedException(
            "This account can only be logged into with Google, or by resetting the password with 'Forgot Password'.",
          ),
        );
      });

      test('it should return an object with _id in it on valid email and password', async () => {
        expect(
          await localStrategy.validate(userStub().email, userStub().password),
        ).toEqual({
          _id: userStub()._id,
        });
      });
    });
  });
});
