import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import { CandidateService } from '../services/candidate.service';
import { Candidate } from '../entities/candidate.entity';
import { PaginatedResponse } from 'src/common/types/paginated-response.type';
import { PaginatedCandidateQueryInput } from '../inputs/paginated-candidate-query.input';
import { CompanyUserTypeEnum } from '../../companies/enums/company-user-type.enum';
import { UpdateCandidateStatusInput } from '../inputs/update-candidate-status.input';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  // GET
  @CompanyAuth()
  @Get('get/:candidateId')
  async getCandidate(
    @Param('candidateId', ParseUUIDPipe) candidateId: string,
    @CurrentUser() user: User,
  ): Promise<Candidate> {
    return this.candidateService.getCandidate(candidateId, user);
  }

  @Get('get_paginated')
  @CompanyAuth()
  async getPaginatedCandidates(
    @CurrentUser() user: User,
    @Query() query: PaginatedCandidateQueryInput,
  ): Promise<PaginatedResponse<Candidate>> {
    return this.candidateService.getPaginatedCandidates(query, user);
  }

  // PATCH
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Patch('update/:candidateId')
  async updateCandidateStatus(
    @Body('input') input: UpdateCandidateStatusInput,
    @Param('candidateId', ParseUUIDPipe) candidateId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.candidateService.updateCandidateStatus(
      candidateId,
      input,
      user,
    );
  }
}
