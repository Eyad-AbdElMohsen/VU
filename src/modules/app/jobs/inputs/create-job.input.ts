import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JobTypeEnum } from '../enums/job-type.enum';
import { IsTimestamp } from 'src/common/validators/timestamp.validator';

export class CreateJobInput {
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

  @IsEnum(JobTypeEnum)
  type: JobTypeEnum;

  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  departments: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(10)
  requirements: string;

  @IsBoolean()
  sendEmailToCandidates: boolean;

  @IsBoolean()
  shareFeedback: boolean;

  @IsTimestamp({ message: 'startDate must be a valid timestamp' })
  startDate: number;

  @IsTimestamp({ message: 'endDate must be a valid timestamp' })
  endDate: number;

  @ArrayMaxSize(10)
  @IsUUID('4', { each: true })
  mockIds: string[];
}
