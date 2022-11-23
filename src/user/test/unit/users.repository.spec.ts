import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { User } from '../../schemas/User.schema';
import { UserRepository } from '../../user.repository';
import { UserModel } from '../mocks/user.model';
import { userStub } from '../stubs/user.stub';

// TODO:- avoid nesting and mutable vars during tests for better maintainable and readable testbase, https://kentcdodds.com/blog/avoid-nesting-when-youre-testing

describe('UsersRepository', () => {
  let userRepository: UserRepository;

  describe('find operations', () => {
    let userModel: UserModel;
    let userFilterQuery: FilterQuery<User>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          UserRepository,
          {
            provide: getModelToken(User.name),
            useClass: UserModel,
          },
        ],
      }).compile();

      userRepository = moduleRef.get<UserRepository>(UserRepository);
      userModel = moduleRef.get<UserModel>(getModelToken(User.name));

      userFilterQuery = {
        _d: userStub()._id,
      };

      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let user: User;

        beforeEach(async () => {
          jest.spyOn(userModel, 'findOne');
          user = await userRepository.findOne(userFilterQuery, { _id: 0 });
        });

        test('then it should call the userModel', () => {
          expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery, {
            _id: 0,
          });
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });

    describe('find', () => {
      describe('when find is called', () => {
        let users: User[];

        beforeEach(async () => {
          jest.spyOn(userModel, 'find');
          users = await userRepository.find(userFilterQuery, { _id: 0 });
        });

        test('then it should call the userModel', () => {
          expect(userModel.find).toHaveBeenCalledWith(userFilterQuery, {
            _id: 0,
          });
        });

        test('then it should return a user', () => {
          expect(users).toEqual([userStub()]);
        });
      });
    });

    describe('findOneAndUpdate', () => {
      describe('when findOneAndUpdate is called', () => {
        let user: User;

        beforeEach(async () => {
          jest.spyOn(userModel, 'findOneAndUpdate');
          user = await userRepository.findOneAndUpdate(
            userFilterQuery,
            userStub(),
          );
        });

        test('then it should call the userModel', () => {
          expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
            userFilterQuery,
            userStub(),
            { new: true },
          );
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('create operations', () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          UserRepository,
          {
            provide: getModelToken(User.name),
            useValue: UserModel,
          },
        ],
      }).compile();

      userRepository = moduleRef.get<UserRepository>(UserRepository);
    });

    describe('create', () => {
      describe('when create is called', () => {
        let user: User;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(UserModel.prototype, 'save');
          constructorSpy = jest.spyOn(UserModel.prototype, 'constructorSpy');
          user = await userRepository.create(userStub());
        });

        test('then it should call the userModel', () => {
          expect(saveSpy).toHaveBeenCalled();
          expect(constructorSpy).toHaveBeenCalledWith(userStub());
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });
});
