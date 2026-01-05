import { PartialType } from '@nestjs/mapped-types';
import { CreateMockInput } from './create-mock.input';
import { IsUUID } from 'class-validator';

export class UpdateMockInput extends PartialType(CreateMockInput) {
  @IsUUID()
  mockId: string;
}
