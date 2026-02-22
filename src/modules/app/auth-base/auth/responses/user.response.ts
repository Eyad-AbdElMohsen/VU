import { OmitType } from '@nestjs/mapped-types';
import { User } from '../../user/entities/user.entity';

export class UserResponse extends OmitType(User, ['password'] as const) {
  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
