import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginateInput } from 'src/common/inputs/paginate.input';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { MockTypeEnum } from '../enums/mock-type.enum';

export class MockFilterInput {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @IsEnum(DifficultyEnum)
  @IsOptional()
  difficulty?: DifficultyEnum;

  @IsEnum(MockTypeEnum)
  @IsOptional()
  type?: MockTypeEnum;

  @IsBoolean()
  @IsOptional()
  enableFollowUpQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  enableRecordReplay?: boolean;
}

export class PaginatedMockQueryInput extends PaginateInput {
  @ValidateNested()
  @IsOptional()
  filter?: MockFilterInput;
}
