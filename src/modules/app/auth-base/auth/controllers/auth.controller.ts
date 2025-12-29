import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Transactional } from 'typeorm-transactional';
import { RegisterManagerInput } from '../inputs/register-manager.input';
import { RequestVerificationCodeInput } from '../inputs/request-verification-code.input';
import {
  ResetPasswordInput,
  VerifyEmailVerificationCodeInput,
} from '../inputs/verify-code.input';
import { LoginInput } from '../inputs/login.input';
import { User } from '../../user/entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AppRequest } from 'src/common/types/request.type';

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
  async verifyEmail(@Body('input') input: VerifyEmailVerificationCodeInput) {
    return await this.authService.verifyEmailVerificationCode(input);
  }

  @Transactional()
  @Post('reset_password')
  async resetPassword(@Body('input') input: ResetPasswordInput) {
    return await this.authService.resetPassword(input);
  }

  @Transactional()
  @Post('login')
  async login(@Body('input') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Transactional()
  @Post('logout')
  @Auth()
  async logout(@Req() req: AppRequest) {
    return await this.authService.logout(req.user!.id, req.sessionId!);
  }

  @Transactional()
  @Post('logout_all_devices')
  @Auth()
  async logoutFromAllDevices(@Req() req: AppRequest) {
    return await this.authService.logoutFromAllDevices(req.user!.id);
  }
}
