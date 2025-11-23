import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Transactional } from 'typeorm-transactional';
import { RegisterManagerInput } from '../inputs/register-manager.input';
import { Response } from 'express';
import { RequestVerificationCodeInput } from '../inputs/request-verification-code.input';
import { User } from 'src/app/users/entities/user.entity';
import { VerifyEmailVerificationCodeInput } from '../inputs/verify-code.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  @Post('register_manager')
  async registerAsCompanyManager(
    @Body('input') input: RegisterManagerInput,
  ): Promise<User> {
    return await this.authService.registerCompanyManager(input);
  }

  @Transactional()
  @Post('code_verify_request')
  async requestVerificationCode(
    @Body('input') input: RequestVerificationCodeInput,
  ) {
    return await this.authService.requestVerificationCode(input);
  }

  @Transactional()
  @Post('verify_email')
  async verifyEmail(
    @Body('input') input: VerifyEmailVerificationCodeInput,
    @Res() res: Response,
  ) {
    return await this.authService.verifyEmailVerificationCode(input, res);
  }
}
