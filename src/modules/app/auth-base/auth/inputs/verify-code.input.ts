import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailVerificationCodeInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
