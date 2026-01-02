import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Transactional } from 'typeorm-transactional';
import {
  RegisterManagerInput,
  RegisterUserInput,
} from '../inputs/register-manager.input';
import { RequestVerificationCodeInput } from '../inputs/request-verification-code.input';
import {
  ResetPasswordInput,
  VerifyEmailVerificationCodeInput,
} from '../inputs/verify-code.input';
import { LoginInput } from '../inputs/login.input';
import { User } from '../../user/entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SessionEntity } from '../../session/entities/session.entity';
import { CurrentSessionId } from 'src/common/decorators/session.decorator';

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
  @Post('companies/:companyId/join_request')
  async newCompanyJoinRequest(
    @Body('input') input: RegisterUserInput,
    @Param('companyId') companyId: string,
  ) {
    return await this.authService.newCompanyJoinRequest(input, companyId);
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
  async logout(
    @CurrentUser() user: User,
    @CurrentSessionId() sessionId: number,
  ) {
    return await this.authService.logout(user.id, sessionId);
  }

  @Transactional()
  @Post('logout_all_devices')
  @Auth()
  async logoutFromAllDevices(@CurrentUser() user: User) {
    return await this.authService.logoutFromAllDevices(user.id);
  }
}
