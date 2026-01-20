import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CandidateStatusEnum } from '../enums/candidate-status.enum';
import { CandidateCheatEnum } from '../enums/candidate-cheat.enum';
import { PaginateInput } from 'src/common/inputs/paginate.input';
import { SortDirectionEnum } from 'src/common/enums/sort.enum';
import { CandidateSortFieldsEnum } from '../enums/candidate-sort-fields.enum';

export class CandidateFilterInput {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @IsEnum(CandidateStatusEnum)
  @IsOptional()
  status?: CandidateStatusEnum;

  @IsEnum(CandidateCheatEnum)
  @IsOptional()
  cheat?: CandidateCheatEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  jobId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minScore?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  maxScore?: number;
}

export class CandidateSortInput {
  @IsOptional()
  @IsEnum(SortDirectionEnum)
  dir?: SortDirectionEnum;

  @IsEnum(CandidateSortFieldsEnum)
  field: CandidateSortFieldsEnum;
}

export class PaginatedCandidateQueryInput extends PaginateInput {
  @ValidateNested()
  @IsOptional()
  filter?: CandidateFilterInput;

  @ValidateNested()
  @IsOptional()
  sort?: CandidateSortInput;
}
