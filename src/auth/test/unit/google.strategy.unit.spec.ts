import { Test } from '@nestjs/testing';
import { mockUserService } from '../../../user/test/mocks/mockUserService';
import { UserService } from '../../../user/user.service';
import { GoogleStrategy } from '../../strategy/google.strategy';
import { faker } from '@faker-js/faker';
import { mockProfile } from '../mocks/mockProfile';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../../test/mocks/mockConfigService';
import { userStub } from '../../../user/test/stubs/user.stub';

// TODO:- avoid nesting and mutable vars during tests for better maintainable and readable testbase, https://kentcdodds.com/blog/avoid-nesting-when-youre-testing

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let userService: UserService;

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
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('validate', () => {
    describe('when validate is called', () => {
      test('it should call userService.findOneUser', async () => {
        await googleStrategy.validate(
          faker.datatype.uuid(),
          faker.datatype.uuid(),
          mockProfile,
          jest.fn,
        );
        expect(userService.findOneUser).toHaveBeenCalledWith(
          { email: mockProfile._json.email },
          { _id: true },
        );
      });

      test('it should call done method with error null and existing user if user already exists ', async () => {
        const mockDone = jest.fn();
        await googleStrategy.validate(
          faker.datatype.uuid(),
          faker.datatype.uuid(),
          mockProfile,
          mockDone,
        );
        expect(mockDone).toHaveBeenCalledWith(null, { _id: userStub()._id });
      });

      test('it should call done method with error null and new user if user does not exist', async () => {
        const mockDone = jest.fn();
        const newUser = {
          _id: faker.datatype.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        };

        jest
          .spyOn(userService, 'findOneUser')
          .mockImplementation(() => Promise.resolve(null));

        jest
          .spyOn(userService, 'createUser')
          .mockImplementationOnce(() => Promise.resolve(newUser));

        await googleStrategy.validate(
          faker.datatype.uuid(),
          faker.datatype.uuid(),
          mockProfile,
          mockDone,
        );

        expect(mockDone).toHaveBeenCalledWith(null, { _id: newUser._id });
      });
    });
  });
});
