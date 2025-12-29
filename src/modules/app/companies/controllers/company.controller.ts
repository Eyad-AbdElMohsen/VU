import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserTypeEnum } from '../../auth-base/user/enums/user.enum';
import { ReplyJoinRequestInput } from '../inputs/reply-join-request.input';
import { AppRequest } from 'src/common/types/request.type';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Auth({
    types: [UserTypeEnum.COMPANY_USER],
  })
  // TODO: Add company auth decorator that take action
  // @CompanyAuth({ types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.VIEWIER] })
  @Post('reply_join_request')
  async replyJoinRequest(
    @Body('input') input: ReplyJoinRequestInput,
    @Req() { companyId }: AppRequest,
  ) {
    //TODO: Remove this condition after adding decorator
    if (!companyId) {
      throw new UnauthorizedException('Company not found');
    }
    return await this.companyService.replyJoinRequest(input, companyId);
  }

  @Auth({
    types: [UserTypeEnum.COMPANY_USER],
  })
  @Post('remove_from_company')
  async removeFromCompany(
    @Body('userId') userId: string,
    @Req() { companyId }: AppRequest,
  ) {
    //TODO: Remove this condition after adding decorator
    if (!companyId) {
      throw new UnauthorizedException('Company not found');
    }
    return await this.companyService.removeUserFromCompany(userId, companyId);
  }
}
