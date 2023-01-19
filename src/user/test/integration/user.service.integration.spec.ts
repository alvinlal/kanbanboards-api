import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { DatabaseService } from '../../../database/database.service';
import { dataSourceOptions } from '../../../database/dataSource';
import { User } from '../../entities/User.entity';
import { UserModule } from '../../user.module';
import { UserService } from '../../user.service';
import { userStub } from '../stubs/user.stub';

describe('UserService', () => {
  let userService: UserService;
  let db: DatabaseService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
        DatabaseModule,
      ],
    }).compile();

    db = module.get<DatabaseService>(DatabaseService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get('UserRepository');
  });

  afterEach(async () => {
    await db.cleanTables();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('findOne()', () => {
    it('should return correct user from db', async () => {
      const { email, password } = userStub();
      const newUser = await userRepository.create({ email, password });
      await userRepository.save(newUser);
      expect(
        await userService.findOne({ email }, { email: true, user_id: true }),
      ).toEqual({ email, user_id: newUser.user_id });
    });
  });

  describe('createUser()', () => {
    it('should create an user in db', async () => {
      const { email, password } = userStub();
      const { user_id } = await userService.createUser(email, password);
      const createdUser = await userRepository.findOne({ where: { email } });
      expect(createdUser).toEqual({ email, password, user_id });
    });
  });

  describe('userExists()', () => {
    it("should return false when user doesn't exist in db", async () => {
      const { email } = userStub();
      expect(await userService.userExists(email)).toBe(false);
    });

    it('should return true when user exists in db', async () => {
      const { email, password } = userStub();
      const newUser = await userRepository.create({ email, password });
      await userRepository.save(newUser);
      expect(await userService.userExists(email)).toBe(true);
    });
  });
});
