import { faker } from '@faker-js/faker';
import { User } from '../../entities/User.entity';

const user_id = faker.datatype.uuid();
const email = faker.internet.email();
const password = faker.internet.password(6);

export const userStub = (): User => {
  return {
    user_id,
    email,
    password,
  };
};
