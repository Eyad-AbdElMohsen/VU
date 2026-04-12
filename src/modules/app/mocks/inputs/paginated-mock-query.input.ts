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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MockFilterInput {
  @ApiPropertyOptional({
    example: 'node',
    description: 'Text search for mock title/description',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional({
    enum: DifficultyEnum,
    example: DifficultyEnum.MEDIUM,
  })
  @IsEnum(DifficultyEnum)
  @IsOptional()
  difficulty?: DifficultyEnum;

  @ApiPropertyOptional({
    enum: MockTypeEnum,
    example: MockTypeEnum.TECHNICAL,
  })
  @IsEnum(MockTypeEnum)
  @IsOptional()
  type?: MockTypeEnum;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  enableFollowUpQuestions?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  enableRecordReplay?: boolean;
}

export class PaginatedMockQueryInput extends PaginateInput {
  @ApiPropertyOptional({ type: () => MockFilterInput })
  @ValidateNested()
  @IsOptional()
  filter?: MockFilterInput;
}
