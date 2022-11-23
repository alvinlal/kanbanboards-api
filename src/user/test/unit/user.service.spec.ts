import { Test } from '@nestjs/testing';
import { UserRepository } from '../../user.repository';
import { UserService } from '../../user.service';
import { mockUserRepository } from '../mocks/mockUserRepository';
import { userStub } from '../stubs/user.stub';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('findOneUser()', () => {
    it('should call userRepository.findOne', async () => {
      await userService.findOneUser({ _id: userStub()._id }, { _id: true });
      expect(userRepository.findOne).toHaveBeenCalledWith(
        { _id: userStub()._id },
        { _id: true },
      );
    });

    it('should return an user ', async () => {
      expect(
        await userService.findOneUser({ _id: userStub()._id }, { _id: true }),
      ).toEqual(userStub());
    });
  });

  describe('createUser()', () => {
    it('should call userRepository.create', async () => {
      await userService.createUser(userStub().email, userStub().password);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: userStub().email,
        password: userStub().password,
      });
    });

    it('should return an user ', async () => {
      expect(
        await userService.createUser(userStub().email, userStub().password),
      ).toEqual(userStub());
    });
  });

  describe('userExists()', () => {
    it('should call userRepository.count', async () => {
      await userService.userExists(userStub().email);

      expect(userRepository.count).toHaveBeenCalledWith({
        email: userStub().email,
      });
    });

    it("should return false if user doesn't exists", async () => {
      expect(await userService.userExists(userStub().email)).toBe(false);
    });

    it('should return true if user exists', async () => {
      jest
        .spyOn(userRepository, 'count')
        .mockImplementationOnce(() => Promise.resolve(1));
      expect(await userService.userExists(userStub().email)).toBe(true);
    });
  });
});
