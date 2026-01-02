import { PickType } from '@nestjs/mapped-types';
import { RegisterUserInput } from '../../auth/inputs/register-manager.input';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ChangePasswordInput extends PickType(RegisterUserInput, [
  'password',
  'confirmPassword',
] as const) {
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must between 8 and 20 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase and one lowercase letter',
  })
  oldPassword: string;
}
