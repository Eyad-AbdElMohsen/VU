import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserInput } from './register-manager.input';

export class LoginInput extends PickType(RegisterUserInput, [
  'email',
  'password',
] as const) {
  @ApiProperty({
    example: 'manager@acme.com',
    description: 'Registered user email',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPass1',
    description: 'User password',
  })
  password: string;
}
