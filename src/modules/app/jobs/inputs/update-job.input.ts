import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateJobInput } from './create-job.input';

export class UpdateJobInput extends PartialType(CreateJobInput) {
	@ApiPropertyOptional({ example: 'Lead Backend Engineer' })
	title?: string;
}
