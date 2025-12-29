import { Module } from '@nestjs/common';
import { CompanyModule } from '../../app/companies/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { AuthService } from 'src/modules/app/auth-base/auth/services/auth.service';
import { AuthController } from 'src/modules/app/auth-base/auth/controllers/auth.controller';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';
import { UserModule } from 'src/modules/app/auth-base/user/user.module';
import { SessionModule } from 'src/modules/app/auth-base/session/session.module';

@Module({
  imports: [
    CompanyModule,
    UserModule,
    SessionModule,
    TypeOrmModule.forFeature([User]),
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
