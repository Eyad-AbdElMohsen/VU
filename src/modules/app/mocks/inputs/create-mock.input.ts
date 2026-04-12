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
import { ApiProperty } from '@nestjs/swagger';

export class CreateMockInput {
  @ApiProperty({
    example: 'Node.js Backend Mock',
    minLength: 3,
    maxLength: 30,
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'Assess Node.js API design, testing, and scalability thinking.',
    minLength: 10,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: DifficultyEnum, example: DifficultyEnum.MEDIUM })
  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @ApiProperty({ enum: MockTypeEnum, example: MockTypeEnum.TECHNICAL })
  @IsEnum(MockTypeEnum)
  type: MockTypeEnum;

  @ApiProperty({
    example: 45,
    minimum: 1,
    description: 'Estimated duration in minutes',
  })
  @IsInt()
  @IsPositive()
  estimatedTimeInMinutes: number;

  @ApiProperty({
    type: [String],
    example: ['Node.js', 'NestJS', 'PostgreSQL'],
    maxItems: 10,
  })
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  technologies: string[];

  @ApiProperty({
    type: [String],
    example: ['REST APIs', 'Testing', 'Performance'],
    maxItems: 10,
  })
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topics: string[];

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['f168e302-f8a4-4cd4-9f7e-f09180f48eec'],
    maxItems: 10,
    description: 'Optional linked job IDs',
  })
  @ArrayMaxSize(10)
  @IsUUID('4', { each: true })
  jobIds: string[];

  @ApiProperty({
    example: true,
    description: 'Allow AI follow-up questions during mock',
  })
  @IsBoolean()
  enableFollowUpQuestions: boolean;

  @ApiProperty({
    example: false,
    description: 'Enable record/replay for candidate session',
  })
  @IsBoolean()
  enableRecordReplay: boolean;

  @ApiProperty({
    type: () => [MockQuestionInput],
    description: 'Mock interview question set',
  })
  @ValidateNested()
  @ArrayMaxSize(10)
  questions: MockQuestionInput[];
}

export class MockQuestionInput {
  @ApiProperty({
    example: 'Explain event loop in Node.js',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    example: 'Describe phases and how asynchronous callbacks are scheduled.',
    minLength: 10,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @ApiProperty({ enum: DifficultyEnum, example: DifficultyEnum.MEDIUM })
  @IsEnum(DifficultyEnum)
  difficulty: DifficultyEnum;

  @ApiProperty({ example: 5, minimum: 1 })
  @IsInt()
  @IsPositive()
  estimatedTimeInMinutes: number;

  @ApiProperty({ example: 1, minimum: 1, description: 'Question order in mock' })
  @IsInt()
  @IsPositive()
  order: number;

  @ApiProperty({ enum: AnswerTypeEnum, example: AnswerTypeEnum.FREE_TEXT })
  @IsEnum(AnswerTypeEnum)
  answerType: AnswerTypeEnum;

  @ApiProperty({
    example: 'The event loop processes timers, I/O callbacks, and microtasks.',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  correctAnswer: string;
}
