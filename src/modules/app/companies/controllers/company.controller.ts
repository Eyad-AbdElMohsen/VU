import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { ReplyJoinRequestInput } from '../inputs/reply-join-request.input';
import { AppRequest } from 'src/common/types/request.type';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';
import { EditCompanyInput } from '../inputs/edit-company.input';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('reply_join_request')
  async replyJoinRequest(
    @Body('input') input: ReplyJoinRequestInput,
    @Req() { companyId }: AppRequest,
  ) {
    return await this.companyService.replyJoinRequest(input, companyId!);
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('remove_from_company')
  async removeFromCompany(
    @Body('userId') userId: string,
    @Req() { companyId }: AppRequest,
  ) {
    return await this.companyService.removeUserFromCompany(userId, companyId!);
  }

  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER],
  })
  @Patch('edit')
  async editCompany(
    @Body() input: EditCompanyInput,
    @Req() { companyId }: AppRequest,
  ) {
    return await this.companyService.editCompany(companyId!, input);
  }
}
