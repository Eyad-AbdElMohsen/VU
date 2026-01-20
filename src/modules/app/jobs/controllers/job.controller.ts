import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import { CompanyUserTypeEnum } from '../../companies/enums/company-user-type.enum';
import { CreateJobInput } from '../inputs/create-job.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import { UpdateJobInput } from '../inputs/update-job.input';
import { PaginatedJobQueryInput } from '../inputs/paginated-job-query.input';
import { Job } from '../entities/job.entity';
import { PaginatedResponse } from 'src/common/types/paginated-response.type';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // ------------------------------- Get --------------------------------------- //
  @CompanyAuth()
  @Get('get/:jobId')
  async getJob(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: User,
  ) {
    return this.jobService.getJob(jobId, user);
  }

  @Get('get_paginated')
  @CompanyAuth()
  async getPaginatedJobs(
    @CurrentUser() user: User,
    @Query() query: PaginatedJobQueryInput,
  ): Promise<PaginatedResponse<Job>> {
    return this.jobService.getPaginatedJobs(query, user);
  }

  // ------------------------------- Post --------------------------------------- //
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Post('create')
  async createJob(
    @Body('input') input: CreateJobInput,
    @CurrentUser() user: User,
  ) {
    return this.jobService.createJob(input, user);
  }

  // ------------------------------ Patch --------------------------------------- //
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Patch('update/:jobId')
  async updateJob(
    @Body('input') input: UpdateJobInput,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: User,
  ) {
    return this.jobService.updateJob(jobId, input, user);
  }

  // ------------------------------ Delete --------------------------------------- //
  @CompanyAuth({
    types: [CompanyUserTypeEnum.OWNER, CompanyUserTypeEnum.EDITOR],
  })
  @Delete('delete/:jobId')
  async deleteJob(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: User,
  ) {
    return this.jobService.deleteJob(jobId, user);
  }
}
