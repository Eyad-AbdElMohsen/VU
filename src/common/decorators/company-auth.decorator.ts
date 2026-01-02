import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { COMPANY_TYPES_KEY, USER_TYPES_KEY } from '../constants/user-type-key';
import { CompanyAuthGuard } from '../guards/company-auth.guard';
import { CompanyAuthOptions } from '../types/company-auth.type';
import { AuthGuard } from '../guards/auth.guard';
import { UserTypeEnum } from 'src/modules/app/auth-base/user/enums/user.enum';

export function CompanyAuth(options: CompanyAuthOptions = {}) {
  const { types = [] } = options;

  return applyDecorators(
    UseGuards(AuthGuard, CompanyAuthGuard),
    SetMetadata(USER_TYPES_KEY, [UserTypeEnum.COMPANY_USER]),
    ...(types.length ? [SetMetadata(COMPANY_TYPES_KEY, types)] : []),
  );
}
