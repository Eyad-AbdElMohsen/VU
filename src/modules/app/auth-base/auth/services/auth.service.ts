import { HttpException, Injectable } from '@nestjs/common';
import { RegisterManagerInput } from '../inputs/register-manager.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCodeEnum } from 'src/config/enums/status-code.enum';
import { RequestVerificationCodeInput } from '../inputs/request-verification-code.input';
import { MailService } from 'src/modules/core/mail/services/mail.service';
import { VerifyEmailVerificationCodeInput } from '../inputs/verify-code.input';
import { LoginInput } from '../inputs/login.input';
import { CompanyService } from '../../../companies/services/company.service';
import { HelperService } from 'src/modules/core/helper/helper.services';
import { User } from '../../user/entities/user.entity';
import { UserVerificationCodeService } from '../../user/services/user-verification-code.service';
import { SessionService } from '../../session/services/session.service';
import { UserVerificationCodeUseCaseEnum } from '../../user/enums/user-verification-code.enum';
import { UserTypeEnum } from '../../user/enums/user.enum';

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

  async registerCompanyManager(input: RegisterManagerInput) {
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

    /* await this.mailService.sendMail(
      user.email,
      `VU Account Verification Code`,
      `Your Request VerificationCode for VU Account is ${verificationCode.code}`,
    ); */
  }

  async verifyEmailVerificationCode(input: VerifyEmailVerificationCodeInput) {
    const { email, code } = input;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User Not Found', StatusCodeEnum.NOT_FOUND);
    }

    if (user.verified) {
      throw new HttpException(
        'User Already Verified',
        StatusCodeEnum.ALREADY_VERIFIED,
      );
    }

    await this.userVerificationCodeService.verifyVerificationCode(
      user.id,
      code,
      UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
    );

    await this.userRepo.update(user.id, {
      verified: true,
    });

    const session = await this.sessionService.createNewSession(user.id);
    const token = await this.helper.generateJwtToken(session.id);

    return this.helper.appendAuthTokenToUser(user, token);
  }

  async login(input: LoginInput) {
    const user = await this.userRepo.findOne({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Bad Credentials',
        StatusCodeEnum.BAD_CREDENTIALS,
      );
    }

    const correctPassword = await this.helper.comparePassword(
      input.password,
      user.password,
    );
    if (!correctPassword) {
      throw new HttpException(
        'Bad Credentials',
        StatusCodeEnum.BAD_CREDENTIALS,
      );
    }

    const session = await this.sessionService.createNewSession(user.id);
    const token = await this.helper.generateJwtToken(session.id);

    return this.helper.appendAuthTokenToUser(user, token);
  }
}
