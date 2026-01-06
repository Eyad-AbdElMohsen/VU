import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { MockTypeEnum } from '../enums/mock-type.enum';
import { AnswerTypeEnum } from '../enums/question-answer-type.enum';

export class CreateMockInput {
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(10)
  description: string;

  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @IsEnum(MockTypeEnum)
  type: MockTypeEnum;

  @IsInt()
  @IsPositive()
  estimatedTimeInMinutes: number;

  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  technologies: string[];

  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topics: string[];

  @ArrayMaxSize(10)
  @IsUUID('4', { each: true })
  jobIds: string[];

  @IsBoolean()
  enableFollowUpQuestions: boolean;

  @IsBoolean()
  enableRecordReplay: boolean;

  @ValidateNested()
  @ArrayMaxSize(10)
  questions: MockQuestionInput[];
}

export class MockQuestionInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @IsInt()
  @IsPositive()
  estimatedTimeInMinutes: number;

  @IsInt()
  @IsPositive()
  order: number;

  @IsEnum(AnswerTypeEnum)
  answerType: AnswerTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  correctAnswer: string;
}
