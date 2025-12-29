import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';

export class ReplyJoinRequestInput {
  @IsUUID()
  userId: string;

  @IsBoolean()
  approved: boolean;

  @IsEnum(CompanyUserTypeEnum)
  @IsOptional()
  type?: CompanyUserTypeEnum;
}
