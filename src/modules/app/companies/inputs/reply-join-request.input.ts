import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReplyJoinRequestInput {
  @ApiProperty({
    example: 'bf997d08-a1fd-4a68-b36f-4a0a0506d0d1',
    format: 'uuid',
    description: 'User ID of the join request owner',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Approve or reject the join request',
  })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({
    enum: CompanyUserTypeEnum,
    example: CompanyUserTypeEnum.VIEWER,
    description: 'Company role if request is approved',
  })
  @IsEnum(CompanyUserTypeEnum)
  @IsOptional()
  type?: CompanyUserTypeEnum;
}
