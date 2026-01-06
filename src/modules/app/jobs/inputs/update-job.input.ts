import { PartialType } from '@nestjs/mapped-types';
import { CreateJobInput } from './create-job.input';
import { IsUUID } from 'class-validator';

export class UpdateJobInput extends PartialType(CreateJobInput) {}
