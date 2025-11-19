import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserVerificationCodeUseCaseEnum } from 'src/app/users/enums/user-verification-code.enum';

export class RequestVerificationCodeInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserVerificationCodeUseCaseEnum)
  @IsNotEmpty()
  useCase: UserVerificationCodeUseCaseEnum;
}
