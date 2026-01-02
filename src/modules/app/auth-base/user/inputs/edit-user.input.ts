import { OmitType, PartialType } from '@nestjs/mapped-types';
import { RegisterUserInput } from '../../auth/inputs/register-manager.input';

export class EditUserInput extends PartialType(
  OmitType(RegisterUserInput, [
    'email',
    'password',
    'confirmPassword',
  ] as const),
) {}
