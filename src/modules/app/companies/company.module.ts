import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyUser } from './entities/company-user.entity';
import { User } from '../auth-base/user/entities/user.entity';
import { MailModule } from 'src/modules/core/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyUser, User]), MailModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
