import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Not, Repository } from 'typeorm';
import { CreateCompanyInput } from 'src/modules/app/auth-base/auth/inputs/register-manager.input';
import { StatusCodeEnum } from 'src/common/enums/status-code.enum';
import { CompanyUser } from '../entities/company-user.entity';
import { ReplyJoinRequestInput } from '../inputs/reply-join-request.input';
import { MailService } from 'src/modules/core/mail/services/mail.service';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';
import { User } from '../../auth-base/user/entities/user.entity';
import { EditCompanyInput } from '../inputs/edit-company.input';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(CompanyUser)
    private readonly companyUserRepo: Repository<CompanyUser>,
    private readonly mailService: MailService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getCompanyById(id: string) {
    const company = await this.companyRepo.findOne({
      where: { id },
    });

    if (!company)
      throw new HttpException(
        'Company Not Found',
        StatusCodeEnum.COMPANY_NOT_FOUND,
      );

    return company;
  }

  async createNewCompany(input: CreateCompanyInput, currentUserId: string) {
    const company = await this.companyRepo.findOne({
      where: { name: input.name },
    });
    if (company) {
      throw new HttpException(
        'Company Name Already Exist',
        StatusCodeEnum.ALREADY_EXIST,
      );
    }

    // TODO: validate logo url

    const newCompany = await this.companyRepo.save({
      ...input,
      managerId: currentUserId,
    });

    await this.companyUserRepo.save({
      userId: currentUserId,
      companyId: newCompany.id,
      approved: true,
      role: CompanyUserTypeEnum.OWNER,
    });

    return newCompany;
  }

  async addNewUserRequestToCompany(companyId: string, userId: string) {
    const alreadyInCompany = await this.companyUserRepo.findOne({
      where: { userId, approved: true },
    });

    if (alreadyInCompany) {
      throw new HttpException(
        'User Already In Company',
        StatusCodeEnum.ALREADY_EXIST,
      );
    }

    return await this.companyUserRepo.save({
      userId,
      companyId,
    });
  }

  async replyJoinRequest(input: ReplyJoinRequestInput, companyId: string) {
    const { approved, userId, type } = input;

    const companyUser = await this.companyUserRepo.findOne({
      where: { userId, companyId },
      relations: { user: true, company: true },
      select: {
        id: true,
        companyId: true,
        userId: true,
        approved: true,
        type: true,
        user: { email: true },
        company: { name: true },
      },
    });

    if (!companyUser) {
      throw new HttpException(
        'No Join Request Found',
        StatusCodeEnum.NOT_FOUND,
      );
    }

    if (approved) {
      if (!type) {
        throw new BadRequestException('Type is required');
      }

      companyUser.approved = true;
      companyUser.type = type;
      await this.companyUserRepo.save(companyUser);

      await this.companyUserRepo.delete({ userId, companyId: Not(companyId) });

      await this.mailService.sendMail(
        companyUser.user.email,
        'Join Request Approved',
        `Congratulations, you have been approved to join <b>${companyUser.company.name}</b>`,
      );

      await this.userRepo.update(userId, { companyId });

      return true;
    }

    await this.companyUserRepo.delete({ companyId, userId });

    await this.mailService.sendMail(
      companyUser.user.email,
      'Join Request Declined',
      `You have been declined to join <b>${companyUser.company.name}</b>`,
    );

    return true;
  }

  async removeUserFromCompany(userId: string, companyId: string) {
    const companyUser = await this.companyUserRepo.findOne({
      where: { userId, companyId, approved: true },
      relations: { user: true, company: true },
      select: {
        id: true,
        companyId: true,
        userId: true,
        approved: true,
        type: true,
        user: { email: true },
        company: { name: true },
      },
    });

    if (!companyUser) {
      throw new HttpException(
        'Company User Not Found',
        StatusCodeEnum.COMPANY_USER_NOT_FOUND,
      );
    }

    await this.companyUserRepo.delete({ userId, companyId });
    await this.userRepo.update(userId, { companyId: undefined });

    await this.mailService.sendMail(
      companyUser.user.email,
      'Removed From Company',
      `You have been removed from <b>${companyUser.company.name}</b>`,
    );

    return true;
  }

  async editCompany(companyId: string, input: EditCompanyInput) {
    const company = await this.getCompanyById(companyId);
    Object.assign(company, input);
    return await this.companyRepo.save(company);
  }
}
