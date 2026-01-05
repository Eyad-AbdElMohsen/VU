import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { ReplyJoinRequestInput } from '../inputs/reply-join-request.input';
import { AppRequest } from 'src/common/types/request.type';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';
import { EditCompanyInput } from '../inputs/edit-company.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('reply_join_request')
  async replyJoinRequest(
    @Body('input') input: ReplyJoinRequestInput,
    @CurrentUser() user: User,
  ) {
    return await this.companyService.replyJoinRequest(
      input,
      user.companyUser.companyId,
    );
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('remove_from_company')
  async removeFromCompany(
    @Body('userId') userId: string,
    @CurrentUser() user: User,
  ) {
    return await this.companyService.removeUserFromCompany(
      userId,
      user.companyUser.companyId,
    );
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER],
  })
  @Patch('update')
  async editCompany(
    @Body() input: EditCompanyInput,
    @CurrentUser() user: User,
  ) {
    return await this.companyService.editCompany(
      user.companyUser.companyId,
      input,
    );
  }
}
