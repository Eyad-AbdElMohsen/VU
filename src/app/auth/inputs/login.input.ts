import { PickType } from '@nestjs/mapped-types';
import { RegisterUserInput } from './register-manager.input';

export class LoginInput extends PickType(RegisterUserInput, [
  'email',
  'password',
] as const) {}
