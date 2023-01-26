import { Test } from '@nestjs/testing';
import { Response } from 'express';
import { mockResponse } from '../../../test/mocks/Response.mock';
import { userStub } from '../../../user/test/stubs/user.stub';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { SetJwtCookieInterceptor } from '../../interceptors/SetJwtCookie.interceptor';
import { mockAuthService } from '../mocks/authService.mock';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const { email, password, user_id } = userStub();

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
  });

  describe('signup()', () => {
    it('should call authService.signup()', async () => {
      await authController.signup({ email, password });
      expect(authService.signup).toBeCalledWith({ email, password });
    });

    it('should return an object with user_id in it', async () => {
      const res = await authController.signup({ email, password });
      expect(res).toEqual({ user_id });
    });
  });

  describe('logout()', () => {
    it('should call res.clearCookie()', () => {
      authController.logout(mockResponse as unknown as Response);
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(1);
    });
  });
});
