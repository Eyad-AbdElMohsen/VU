import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobStatusEnum } from '../enums/job-status.enum';
import { JobTypeEnum } from '../enums/job-type.enum';
import { PaginateInput } from 'src/common/inputs/paginate.input';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class JobFilterInput {
  @ApiPropertyOptional({
    example: 'backend',
    description: 'Text search for job title/description',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional({
    enum: JobStatusEnum,
    example: JobStatusEnum.ACTIVE,
  })
  @IsEnum(JobStatusEnum)
  @IsOptional()
  status?: JobStatusEnum;

  @ApiPropertyOptional({
    enum: JobTypeEnum,
    example: JobTypeEnum.FULL_TIME,
  })
  @IsEnum(JobTypeEnum)
  @IsOptional()
  type?: JobTypeEnum;
}

export class PaginatedJobQueryInput extends PaginateInput {
  @ApiPropertyOptional({ type: () => JobFilterInput })
  @ValidateNested()
  @Type(() => JobFilterInput)
  @IsOptional()
  filter?: JobFilterInput;
}
