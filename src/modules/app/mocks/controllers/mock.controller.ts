import { Body, Controller, Post, Query } from '@nestjs/common';
import { MockService } from '../services/mock.service';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CompanyUserTypeEnum } from '../../companies/enums/company-user-type.enum';
import { CreateMockInput } from '../inputs/create-mock.input';
import { UpdateMockInput } from '../inputs/update-mock.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import { PaginatedMockQueryInput } from '../inputs/paginated-mock-query.input';
import { PaginatedResponse } from 'src/common/types/paginated-response.type';
import { Mock } from '../entities/mock.entity';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  // --------------------------- GET ---------------------------
  @Post('get')
  @CompanyAuth()
  async getMock(@Body('mockId') mockId: string, @CurrentUser() user: User) {
    return this.mockService.getMock(mockId, user);
  }

  @Post('paginated')
  @CompanyAuth()
  async getPaginatedMocks(
    @CurrentUser() user: User,
    @Query() query: PaginatedMockQueryInput,
  ): Promise<PaginatedResponse<Mock>> {
    return this.mockService.getPaginatedMocks(query, user);
  }

  // --------------------------- POST ---------------------------
  @Post('create')
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  async createNewMock(
    @Body('input') input: CreateMockInput,
    @CurrentUser() user: User,
  ) {
    return this.mockService.createMock(input, user);
  }

  @Post('update')
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  async updateMock(
    @Body('input') input: UpdateMockInput,
    @CurrentUser() user: User,
  ) {
    return this.mockService.updateMock(input, user);
  }

  @Post('delete')
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  async deleteMock(@Body('mockId') mockId: string, @CurrentUser() user: User) {
    return this.mockService.deleteMock(mockId, user);
  }
}
