import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserTypeEnum } from '../enums/user.enum';
import { AppRequest } from 'src/common/types/request.type';
import { EditUserInput } from '../inputs/edit-user.input';
import { ChangePasswordInput } from '../inputs/change-password.input';

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

  @Patch('edit')
  @Auth()
  async editProfile(@Body() input: EditUserInput, @Req() { user }: AppRequest) {
    return this.userService.editUser(user!.id, input);
  }

  @Patch('change-password')
  @Auth()
  async changePassword(
    @Body() input: ChangePasswordInput,
    @Req() { user }: AppRequest,
  ) {
    return this.userService.changePassword(user!.id, input);
  }
}
