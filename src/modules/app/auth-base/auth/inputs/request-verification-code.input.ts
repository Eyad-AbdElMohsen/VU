import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserVerificationCodeUseCaseEnum } from '../../user/enums/user-verification-code.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RequestVerificationCodeInput {
  @ApiProperty({
    example: 'candidate@acme.com',
    description: 'Email to receive the verification code',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: UserVerificationCodeUseCaseEnum,
    example: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
    description: 'Purpose of the verification code request',
  })
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @IsNotEmpty()
  useCase: UserVerificationCodeUseCaseEnum;
}
