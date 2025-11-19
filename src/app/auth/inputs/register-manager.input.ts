import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CompanyIndustryEnum } from 'src/app/companies/enums/company-industry.enum';

export class RegisterUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must between 8 and 20 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase and one lowercase letter',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Confirm Password must between 8 and 20 characters',
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Confirm Password must contain at least one uppercase and one lowercase letter',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}

export class CreateCompanyInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CompanyIndustryEnum)
  industry: CompanyIndustryEnum;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  website?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class RegisterManagerInput {
  @ValidateNested()
  @Type(() => RegisterUserInput)
  userInput: RegisterUserInput;

  @ValidateNested()
  @Type(() => CreateCompanyInput)
  companyInput: CreateCompanyInput;
}
