import { PartialType } from '@nestjs/mapped-types';
import { CreateMockInput } from './create-mock.input';

export class UpdateMockInput extends PartialType(CreateMockInput) {}
