import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Transactional } from "typeorm-transactional";
import { RegisterManagerInput } from "../inputs/register-manager.input";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Transactional()
  @Post('register_manager')
  async registerAsCompanyManager(
    @Body('input') input: RegisterManagerInput,
    @Res() res: Response
  ) {
    return await this.authService.registerCompanyManager(input, res)
  }
}