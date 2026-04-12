import { PickType } from '@nestjs/mapped-types';
import { RegisterUserInput } from '../../auth/inputs/register-manager.input';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordInput extends PickType(RegisterUserInput, [
  'password',
  'confirmPassword',
] as const) {
  @ApiProperty({
    example: 'StrongPass1',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must between 8 and 20 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase and one lowercase letter',
  })
  oldPassword: string;

  @ApiProperty({
    example: 'NewStrongPass1',
    description: 'New password',
  })
  password: string;

  @ApiProperty({
    example: 'NewStrongPass1',
    description: 'New password confirmation',
  })
  confirmPassword: string;
}
