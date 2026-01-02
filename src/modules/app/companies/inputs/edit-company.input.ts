import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyInput } from '../../auth-base/auth/inputs/register-manager.input';

export class EditCompanyInput extends PartialType(CreateCompanyInput) {}
