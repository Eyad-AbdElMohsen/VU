import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationCodeInput {
  @ApiProperty({
    example: '482913',
    description: 'Verification code sent to user email',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
export class VerifyEmailVerificationCodeInput extends VerificationCodeInput {
  @ApiProperty({
    example: 'candidate@acme.com',
    description: 'Email address that received the code',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordInput extends VerifyEmailVerificationCodeInput {
  @ApiProperty({
    example: 'NewStrongPass1',
    minLength: 8,
    maxLength: 20,
    description: 'New password with uppercase and lowercase letters',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must between 8 and 20 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase and one lowercase letter',
  })
  newPassword: string;
}
