import { UserTypeEnum } from 'src/modules/app/auth-base/user/enums/user.enum';

export type AuthOptions = {
  types?: UserTypeEnum[];
  /**
   * TODO: Add permissions, we will add permission enum for every module
   * and implement a type for all of them and put it here
   */
};
