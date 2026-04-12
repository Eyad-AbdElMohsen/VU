import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMockInput } from './create-mock.input';

export class UpdateMockInput extends PartialType(CreateMockInput) {
  @ApiPropertyOptional({ example: 'Advanced Node.js Backend Mock' })
  title?: string;
}
