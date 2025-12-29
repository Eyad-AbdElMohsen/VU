import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyInput } from 'src/modules/app/auth-base/auth/inputs/register-manager.input';
import { StatusCodeEnum } from 'src/config/enums/status-code.enum';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

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

    return await this.companyRepo.save({
      ...input,
      managerId: currentUserId,
    });
  }
}
