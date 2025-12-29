import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserTypeEnum } from '../enums/user.enum';
import { AppRequest } from 'src/common/types/request.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Auth()
  async me(@Req() req: AppRequest) {
    return req.user!;
  }

  @Get(':id')
  @Auth({
    types: [UserTypeEnum.ADMIN],
  })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
}
