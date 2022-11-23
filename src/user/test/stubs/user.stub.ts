import { faker } from '@faker-js/faker';
import { User } from '../../schemas/User.schema';

const _id = faker.datatype.uuid();
const email = faker.internet.email();
const password = faker.internet.password(6);

export const userStub = (): User => {
  return {
    _id,
    email,
    password,
  };
};
