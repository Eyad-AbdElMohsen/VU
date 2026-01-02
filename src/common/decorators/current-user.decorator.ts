import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppRequest } from '../types/request.type';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';
import { UserTypeEnum } from 'src/modules/app/auth-base/user/enums/user.enum';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    if (user.userType === UserTypeEnum.COMPANY_USER && !user.companyUser) {
      throw new InternalServerErrorException(
        'Company User not found in request',
      );
    }

    return user;
  },
);
