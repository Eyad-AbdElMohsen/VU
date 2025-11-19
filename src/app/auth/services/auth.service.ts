import { HttpException, Injectable } from '@nestjs/common';
import { RegisterManagerInput } from '../inputs/register-manager.input';
import { CompanyService } from 'src/app/companies/services/company.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/users/entities/user.entity';
import { Repository } from 'typeorm';
import { StatusCodeEnum } from 'src/config/enums/status-code.enum';
import { HelperService } from 'src/app/helper/helper.services';
import { UserVerificationCodeService } from 'src/app/users/services/user-verification-code.service';
import { UserVerificationCodeUseCaseEnum } from 'src/app/users/enums/user-verification-code.enum';
import { UserTypeEnum } from 'src/app/users/enums/user.enum';
import { SessionService } from 'src/app/session/services/session.service';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { RequestVerificationCodeInput } from '../inputs/request-verification-code.input';
import { MailService } from 'src/app/mail/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly companyService: CompanyService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly helper: HelperService,
    private readonly userVerificationCodeService: UserVerificationCodeService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
  ) {}

  async registerCompanyManager(input: RegisterManagerInput, res: Response) {
    const { companyInput, userInput } = input;

    const isUserExist = await this.userRepo.findOne({
      where: { email: userInput.email },
    });
    if (isUserExist && isUserExist.verified) {
      throw new HttpException(
        'User Email Already Exist',
        StatusCodeEnum.ALREADY_EXIST,
      );
    }
    //Delete any unverified user with this email
    await this.userRepo.delete({ email: userInput.email });

    if (userInput.password !== userInput.confirmPassword) {
      throw new HttpException(
        'Password Must be similar to ConfirmPassword',
        StatusCodeEnum.INVALID_PASSWORD,
      );
    }

    // TODO: validate profile pic url

    const newUser = await this.userRepo.save({
      ...userInput,
      verified: false,
      userType: UserTypeEnum.COMPANY_MANAGER,
      password: await this.helper.hashPassword(userInput.password),
    });

    await this.userVerificationCodeService.createVerificationCode(
      newUser.id,
      UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
    );
    await this.companyService.createNewCompany(companyInput, newUser.id);

    return newUser;
    // const session = await this.sessionService.createNewSession(newUser.id)
    // const token = this.helper.generateJwtToken(session.id)

    // return this.helper.appendAuthTokenToUser(newUser, token, res)
  }

  async requestVerificationCode(input: RequestVerificationCodeInput) {
    const { email, useCase } = input;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User Not Found', StatusCodeEnum.NOT_FOUND);
    }

    switch (useCase) {
      case UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION:
        await this.handleEmailVerificationRequest(user);
    }
    return true;
  }

  async handleEmailVerificationRequest(user: User) {
    if (user.verified) {
      throw new HttpException(
        'User Already Verified',
        StatusCodeEnum.ALREADY_VERIFIED,
      );
    }
    const verificationCode =
      await this.userVerificationCodeService.getUserVerificationCode(
        user.id,
        UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
      );

    if (!verificationCode) {
      throw new HttpException(
        'No Verification Code Found, Please Request a New One',
        StatusCodeEnum.NOT_FOUND,
      );
    }

    await this.mailService.sendMail(
      user.email,
      `VU Account Verification Code`,
      `Your Request VerificationCode for VU Account is ${verificationCode.code}`,
    );
  }
}
