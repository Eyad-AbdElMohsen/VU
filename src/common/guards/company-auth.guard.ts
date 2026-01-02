import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CompanyUserTypeEnum } from 'src/modules/app/companies/enums/company-user-type.enum';
import { COMPANY_TYPES_KEY } from '../constants/user-type-key';
import { Reflector } from '@nestjs/core';
import { AppRequest } from '../types/request.type';

@Injectable()
export class CompanyAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const allowedTypes = this.reflector.getAllAndOverride<
      CompanyUserTypeEnum[]
    >(COMPANY_TYPES_KEY, [context.getHandler(), context.getClass()]);
    const req: AppRequest = context.switchToHttp().getRequest();
    const user = req.user;

    if (
      allowedTypes?.length &&
      !allowedTypes.includes(user!.companyUser.type)
    ) {
      throw new ForbiddenException('You can not perform this action');
    }

    return true;
  }
}
