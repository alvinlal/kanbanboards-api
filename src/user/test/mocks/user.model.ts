import { MockModel } from '../../../database/test/mocks/mock.model';
import { User } from '../../schemas/User.schema';
import { userStub } from '../stubs/user.stub';

export class UserModel extends MockModel<User> {
  protected entityStub: User = userStub();
}
