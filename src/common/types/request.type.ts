import { Request } from 'express';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';

export type AppRequest = Request & {
  user?: User;
  sessionId?: number;
  companyId?: string;
};
