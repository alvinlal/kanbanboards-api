import { Test } from '@nestjs/testing';
import { UserService } from '../../../user/user.service';
import { GoogleStrategy } from '../../strategy/google.strategy';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { userStub } from '../../../user/test/stubs/user.stub';
import { mockUserService } from '../../../user/test/mock/userService.mock';
import { mockConfigService } from '../../../test/mocks/configService.mock';
import { mockProfile } from '../mocks/profile.mock';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;

  const { email, user_id } = userStub();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService, UserService, GoogleStrategy],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    googleStrategy = moduleRef.get<GoogleStrategy>(GoogleStrategy);
  });

  describe('validate()', () => {
    it('should call userService.findOne', async () => {
      await googleStrategy.validate(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        mockProfile,
        jest.fn,
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith(
        { email },
        { user_id: true },
      );
    });

    it('it should call done method with error null and existing user if user already exists ', async () => {
      const mockDone = jest.fn();
      await googleStrategy.validate(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        mockProfile,
        mockDone,
      );
      expect(mockDone).toHaveBeenCalledWith(null, { user_id });
    });

    it('it should call done method with error null and new user if user does not exist', async () => {
      const mockDone = jest.fn();
      const newUser = {
        user_id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await googleStrategy.validate(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        mockProfile,
        mockDone,
      );

      mockUserService.findOne.mockResolvedValueOnce(null);

      mockUserService.createUser.mockResolvedValueOnce(newUser);

      await googleStrategy.validate(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        mockProfile,
        mockDone,
      );

      expect(mockDone).toHaveBeenCalledWith(null, { user_id: newUser.user_id });
    });
  });
});
