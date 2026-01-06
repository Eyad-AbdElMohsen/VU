import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { JobMockService } from '../services/job-mock.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../../auth-base/user/entities/user.entity';
import { CompanyAuth } from 'src/common/decorators/company-auth.decorator';

@Controller('job-mock')
export class JobMockController {
  constructor(private readonly jobMockService: JobMockService) {}
  @Get('job/:jobId')
  @CompanyAuth()
  getJobMocksCount(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: User,
  ) {
    return this.jobMockService.getJobMocksCount(jobId, user);
  }

  @Get('mock/:mockId')
  @CompanyAuth()
  getMockJobsCount(
    @Param('mockId', ParseUUIDPipe) mockId: string,
    @CurrentUser() user: User,
  ) {
    return this.jobMockService.getMockJobsCount(mockId, user);
  }
}
