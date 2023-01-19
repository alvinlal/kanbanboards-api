import { UserService } from '../../user.service';
import { userRepositoryMock } from '../mock/userRepository.mock';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/User.entity';
import { faker } from '@faker-js/faker';
import { userStub } from '../stubs/user.stub';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  describe('findOne()', () => {
    it('should call userRepository.findOne()', async () => {
      const email = faker.internet.email();
      await userService.findOne({ email }, { user_id: true, email: true });
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          email,
        },

        select: { user_id: true, email: true },
      });
    });

    it('should return correct user', async () => {
      const email = faker.internet.email();
      expect(
        await userService.findOne({ email }, { user_id: true, email: true }),
      ).toEqual(userStub());
    });
  });

  describe('createUser()', () => {
    it('should call userRepository.create()', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      await userService.createUser(email, password);

      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        email,
        password,
      });
    });

    it('should call userRepository.save()', async () => {
      const { email, password, user_id } = userStub();

      await userService.createUser(email, password);

      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        email,
        password,
        user_id,
      });
    });

    it('should return object with newly created user_id', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      expect(await userService.createUser(email, password)).toEqual({
        user_id: userStub().user_id,
      });
    });
  });

  describe('userExists()', () => {
    it('should call userRepository.count()', async () => {
      const email = faker.internet.email();

      userRepositoryMock.count.mockResolvedValueOnce(0);

      await userService.userExists(email);

      expect(userRepositoryMock.count).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it("should return false when user doesn't exist", async () => {
      const email = faker.internet.email();

      userRepositoryMock.count.mockResolvedValueOnce(0);

      expect(await userService.userExists(email)).toBe(false);
    });

    it('should return true when user exists', async () => {
      const email = faker.internet.email();

      userRepositoryMock.count.mockResolvedValueOnce(1);

      expect(await userService.userExists(email)).toBe(true);
    });
  });
});
