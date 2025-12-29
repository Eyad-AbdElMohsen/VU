import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserVerificationCodeService } from './services/user-verification-code.service';
import { UserVerificationCode } from './entities/user-verification-codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserVerificationCode])],
  controllers: [UserController],
  providers: [UserService, UserVerificationCodeService],
  exports: [UserService, UserVerificationCodeService],
})
export class UserModule {}
