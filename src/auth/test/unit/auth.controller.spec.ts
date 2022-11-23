import { Test } from '@nestjs/testing';
import { User } from '../../../user/schemas/User.schema';
import { userStub } from '../../../user/test/stubs/user.stub';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { SetJwtCookieInterceptor } from '../../interceptors/SetJwtCookie.interceptor';
import { mockAuthService } from '../mocks/mockAuthService';

// TODO:- avoid nesting and mutable vars during tests for better maintainable and readable testbase, https://kentcdodds.com/blog/avoid-nesting-when-youre-testing

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideInterceptor(SetJwtCookieInterceptor)
      .useValue({})
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    describe('when signup is called', () => {
      let user: Partial<User>;

      beforeEach(async () => {
        user = await authController.signup({
          email: userStub().email,
          password: userStub().password,
        });
      });

      test('it should call authService.signup', () => {
        expect(authService.signup).toBeCalledWith({
          email: userStub().email,
          password: userStub().password,
        });
      });

      test('it should return an object with _id in it', () => {
        expect(user).toEqual({ _id: userStub()._id });
      });
    });
  });
});
