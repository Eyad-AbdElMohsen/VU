import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { JobMockService } from '../services/job-mock.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Job Mock Stats')
@ApiBearerAuth('access-token')
@Controller('job-mock')
export class JobMockController {
  constructor(private readonly jobMockService: JobMockService) {}

  @Get('job/:jobId')
  @CompanyAuth()
  @ApiOperation({ summary: 'Get number of mocks linked to a job' })
  @ApiParam({
    name: 'jobId',
    format: 'uuid',
    example: 'f168e302-f8a4-4cd4-9f7e-f09180f48eec',
  })
  @ApiOkResponse({
    schema: { type: 'number', example: 4 },
    description: 'Total mocks linked to the job',
  })
  getJobMocksCount(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.jobMockService.getJobMocksCount(jobId, user);
  }

  @Get('mock/:mockId')
  @CompanyAuth()
  @ApiOperation({ summary: 'Get number of jobs linked to a mock' })
  @ApiParam({
    name: 'mockId',
    format: 'uuid',
    example: '50d05366-a485-4b84-a2cc-f7bb0f58472e',
  })
  @ApiOkResponse({
    schema: { type: 'number', example: 7 },
    description: 'Total jobs linked to the mock',
  })
  getMockJobsCount(
    @Param('mockId', ParseUUIDPipe) mockId: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.jobMockService.getMockJobsCount(mockId, user);
  }
}
