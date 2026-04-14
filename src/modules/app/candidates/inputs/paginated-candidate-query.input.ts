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
import { Type } from 'class-transformer';
import { CandidateStatusEnum } from '../enums/candidate-status.enum';
import { CandidateCheatEnum } from '../enums/candidate-cheat.enum';
import { PaginateInput } from 'src/common/inputs/paginate.input';
import { SortDirectionEnum } from 'src/common/enums/sort.enum';
import { CandidateSortFieldsEnum } from '../enums/candidate-sort-fields.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CandidateFilterInput {
  @ApiPropertyOptional({
    example: 'frontend',
    description: 'Text search across candidate fields',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional({
    enum: CandidateStatusEnum,
    example: CandidateStatusEnum.SHORTLISTED,
  })
  @IsEnum(CandidateStatusEnum)
  @IsOptional()
  status?: CandidateStatusEnum;

  @ApiPropertyOptional({
    enum: CandidateCheatEnum,
    example: CandidateCheatEnum.CLEAN,
  })
  @IsEnum(CandidateCheatEnum)
  @IsOptional()
  cheat?: CandidateCheatEnum;

  @ApiPropertyOptional({
    example: 'f168e302-f8a4-4cd4-9f7e-f09180f48eec',
    format: 'uuid',
    description: 'Filter by job ID',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  jobId?: string;

  @ApiPropertyOptional({
    example: 20,
    minimum: 0,
    maximum: 100,
    description: 'Minimum candidate score',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minScore?: number;

  @ApiPropertyOptional({
    example: 90,
    minimum: 0,
    maximum: 100,
    description: 'Maximum candidate score',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  maxScore?: number;
}

export class CandidateSortInput {
  @ApiPropertyOptional({
    enum: SortDirectionEnum,
    example: SortDirectionEnum.DESC,
  })
  @IsOptional()
  @IsEnum(SortDirectionEnum)
  dir?: SortDirectionEnum;

  @ApiProperty({
    enum: CandidateSortFieldsEnum,
    example: CandidateSortFieldsEnum.CREATED_AT,
  })
  @IsEnum(CandidateSortFieldsEnum)
  field: CandidateSortFieldsEnum;
}

export class PaginatedCandidateQueryInput extends PaginateInput {
  @ApiPropertyOptional({ type: () => CandidateFilterInput })
  @ValidateNested()
  @Type(() => CandidateFilterInput)
  @IsOptional()
  filter?: CandidateFilterInput;

  @ApiPropertyOptional({ type: () => CandidateSortInput })
  @ValidateNested()
  @Type(() => CandidateSortInput)
  @IsOptional()
  sort?: CandidateSortInput;
}
