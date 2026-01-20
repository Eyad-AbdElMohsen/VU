import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JobStatusEnum } from '../enums/job-status.enum';
import { JobTypeEnum } from '../enums/job-type.enum';
import { PaginateInput } from 'src/common/inputs/paginate.input';

export class JobFilterInput {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @IsEnum(JobStatusEnum)
  @IsOptional()
  status?: JobStatusEnum;

  @IsEnum(JobTypeEnum)
  @IsOptional()
  type?: JobTypeEnum;
}

export class PaginatedJobQueryInput extends PaginateInput {
  @ValidateNested()
  @IsOptional()
  filter?: JobFilterInput;
}
