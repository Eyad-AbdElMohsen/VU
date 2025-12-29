import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class VerificationCodeInput {
  @IsNotEmpty()
  @IsString()
  code: string;
}
export class VerifyEmailVerificationCodeInput extends VerificationCodeInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordInput extends VerifyEmailVerificationCodeInput {
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must between 8 and 20 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase and one lowercase letter',
  })
  newPassword: string;
}
