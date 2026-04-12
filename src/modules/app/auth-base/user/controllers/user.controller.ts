import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserTypeEnum } from '../enums/user.enum';
import { AppRequest } from 'src/common/types/request.type';
import { EditUserInput } from '../inputs/edit-user.input';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { UserResponse } from '../../auth/responses/user.response';
import {
  ApiExtraModels,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiExtraModels(EditUserInput, ChangePasswordInput)
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Auth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({ type: UserResponse })
  async me(@Req() req: AppRequest): Promise<UserResponse> {
    return new UserResponse(req.user!);
  }

  @Get(':id')
  @Auth({
    types: [UserTypeEnum.ADMIN],
  })
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example: 'bf997d08-a1fd-4a68-b36f-4a0a0506d0d1',
  })
  @ApiOkResponse({ type: User })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Patch('edit')
  @Auth()
  @ApiOperation({ summary: 'Update profile details for current user' })
  @ApiBody({
    schema: {
      allOf: [{ $ref: getSchemaPath(EditUserInput) }],
      example: {
        firstName: 'Aya',
        lastName: 'Hassan',
        phone: '+201066677788',
        profilePictureUrl: 'https://cdn.example.com/profiles/aya-updated.jpg',
      },
    },
  })
  @ApiOkResponse({ type: User })
  async editProfile(
    @Body() input: EditUserInput,
    @Req() { user }: AppRequest,
  ): Promise<User> {
    return this.userService.editUser(user!.id, input);
  }

  @Patch('change-password')
  @Auth()
  @ApiOperation({ summary: 'Change password for current authenticated user' })
  @ApiBody({
    schema: {
      allOf: [{ $ref: getSchemaPath(ChangePasswordInput) }],
      example: {
        oldPassword: 'StrongPass1',
        password: 'NewStrongPass1',
        confirmPassword: 'NewStrongPass1',
      },
    },
  })
  @ApiOkResponse({ description: 'Password changed successfully' })
  async changePassword(
    @Body() input: ChangePasswordInput,
    @Req() { user }: AppRequest,
  ): Promise<boolean> {
    return this.userService.changePassword(user!.id, input);
  }
}
