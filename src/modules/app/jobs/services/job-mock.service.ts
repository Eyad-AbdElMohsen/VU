import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobMock } from '../entities/job-mock.entity';
import { Repository } from 'typeorm';
import { User } from '../../auth-base/user/entities/user.entity';
import { StatusCodeEnum } from 'src/common/enums/status-code.enum';
import { Job } from '../entities/job.entity';
import { Mock } from '../../mocks/entities/mock.entity';

@Injectable()
export class JobMockService {
  constructor(
    @InjectRepository(JobMock)
    private readonly jobMockRepo: Repository<JobMock>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(Mock) private readonly mockRepo: Repository<Mock>,
  ) {}

  async getJobMocksCount(jobId: string, user: User) {
    // only for check if this user is authorized for that job
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
    });

    if (!job)
      throw new HttpException('Job Not Found', StatusCodeEnum.JOB_NOT_FOUND);

    if (job.companyId !== user.companyUser.companyId)
      throw new HttpException(
        'You can not access this Job',
        StatusCodeEnum.FORBIDDEN,
      );

    return this.jobMockRepo.count({
      where: { jobId },
    });
  }

  async getMockJobsCount(mockId: string, user: User) {
    // only for check if this user is authorized for that mock
    const mock = await this.mockRepo.findOne({
      where: { id: mockId },
    });

    if (!mock)
      throw new HttpException('Mock Not Found', StatusCodeEnum.MOCK_NOT_FOUND);

    if (mock.companyId !== user.companyUser.companyId)
      throw new HttpException(
        'You can not access this Job',
        StatusCodeEnum.FORBIDDEN,
      );

    return this.jobMockRepo.count({
      where: { mockId },
    });
  }
}
