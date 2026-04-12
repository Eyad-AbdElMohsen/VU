import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { ReplyJoinRequestInput } from '../inputs/reply-join-request.input';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';
import { EditCompanyInput } from '../inputs/edit-company.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import {
  ApiExtraModels,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiExtraModels(ReplyJoinRequestInput, EditCompanyInput)
@ApiTags('Companies')
@ApiBearerAuth('access-token')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('reply_join_request')
  @ApiOperation({ summary: 'Approve or reject pending company join request' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['input'],
      properties: {
        input: { $ref: getSchemaPath(ReplyJoinRequestInput) },
      },
      example: {
        input: {
          userId: 'bf997d08-a1fd-4a68-b36f-4a0a0506d0d1',
          approved: true,
          type: 'VIEWER',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Join request processed successfully' })
  async replyJoinRequest(
    @Body('input') input: ReplyJoinRequestInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.companyService.replyJoinRequest(
      input,
      user.companyUser.companyId,
    );
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('remove_from_company')
  @ApiOperation({ summary: 'Remove a user from current company' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example: 'bf997d08-a1fd-4a68-b36f-4a0a0506d0d1',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'User removed from company successfully' })
  async removeFromCompany(
    @Body('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.companyService.removeUserFromCompany(
      userId,
      user.companyUser.companyId,
    );
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER],
  })
  @Patch('update')
  @ApiOperation({ summary: 'Update current company profile information' })
  @ApiBody({
    schema: {
      allOf: [{ $ref: getSchemaPath(EditCompanyInput) }],
      example: {
        name: 'Acme Labs Egypt',
        website: 'https://acme-eg.com',
        description: 'Expanded AI recruitment platform in MENA region.',
      },
    },
  })
  @ApiOkResponse({ description: 'Company profile updated' })
  async editCompany(
    @Body() input: EditCompanyInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.companyService.editCompany(
      user.companyUser.companyId,
      input,
    );
  }
}
