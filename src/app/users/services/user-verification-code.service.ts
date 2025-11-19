import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVerificationCode } from '../entities/user-verification-codes.entity';
import { Repository } from 'typeorm';
import { UserVerificationCodeUseCaseEnum } from '../enums/user-verification-code.enum';
import { HelperService } from 'src/app/helper/helper.services';

@Injectable()
export class UserVerificationCodeService {
  constructor(
    @InjectRepository(UserVerificationCode)
    private readonly userVerificationCodeRepo: Repository<UserVerificationCode>,
    private readonly helper: HelperService,
  ) {}

  async createVerificationCode(
    userId: string,
    useCase: UserVerificationCodeUseCaseEnum,
  ): Promise<UserVerificationCode> {
    await this.deleteUserVerificationCode(userId, useCase);

    return await this.userVerificationCodeRepo.save({
      userId,
      useCase,
      code:
        process.env.NODE_ENV === 'development'
          ? '1234'
          : this.helper.createRandomCodeNumber(4),
      expireAt: new Date(Date.now() + 15 * 60 * 1000),
    });
  }

  async deleteUserVerificationCode(
    userId: string,
    useCase: UserVerificationCodeUseCaseEnum,
  ) {
    await this.userVerificationCodeRepo.delete({
      user: { id: userId },
      useCase,
    });
  }

  async getUserVerificationCode(
    userId: string,
    useCase: UserVerificationCodeUseCaseEnum,
  ) {
    return await this.userVerificationCodeRepo.findOne({
      where: {
        user: { id: userId },
        useCase,
      },
    });
  }
}
