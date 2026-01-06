import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { In, Repository } from 'typeorm';
import { CreateJobInput } from '../inputs/create-job.input';
import { User } from '../../auth-base/user/entities/user.entity';
import { StatusCodeEnum } from 'src/common/enums/status-code.enum';
import { JobStatusEnum } from '../enums/job-status.enum';
import { JobMock } from '../entities/job-mock.entity';
import { Mock } from '../../mocks/entities/mock.entity';
import { UpdateJobInput } from '../inputs/update-job.input';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(JobMock)
    private readonly jobMockRepo: Repository<JobMock>,
    @InjectRepository(Mock) private readonly mockRepo: Repository<Mock>,
  ) {}

  async getJob(jobId: string, user: User) {
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
      relations: { jobMocks: { mock: true } },
    });

    if (!job)
      throw new HttpException('Job Not Found', StatusCodeEnum.JOB_NOT_FOUND);

    this.validateJobUser(job, user);

    return job;
  }

  async createJob(input: CreateJobInput, user: User) {
    const { mockIds, startDate, endDate, ...rest } = input;

    this.validateDateRange(startDate, endDate);

    const status: JobStatusEnum =
      +startDate < new Date().getTime()
        ? JobStatusEnum.SCHEDULED
        : JobStatusEnum.ACTIVE;

    let job = this.jobRepo.create({
      ...rest,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      companyId: user.companyUser.companyId,
    });

    job = await this.jobRepo.save(job);

    if (mockIds.length) {
      job = await this.addMocksToJob(job, mockIds);
    }

    return job;
  }

  async updateJob(jobId: string, input: UpdateJobInput, user: User) {
    const { mockIds, startDate, endDate, ...rest } = input;

    let job = await this.jobRepo.findOne({
      where: { id: jobId },
    });

    if (!job)
      throw new HttpException('Job Not Found', StatusCodeEnum.JOB_NOT_FOUND);

    this.validateJobUser(job, user);

    const start = startDate ?? job.startDate.getTime();
    const end = endDate ?? job.endDate.getTime();

    const status: JobStatusEnum =
      +start < new Date().getTime()
        ? JobStatusEnum.SCHEDULED
        : JobStatusEnum.ACTIVE;

    this.validateDateRange(start, end);

    Object.assign(job, {
      ...rest,
      startDate: new Date(start),
      endDate: new Date(end),
      status,
    });
    await this.jobRepo.save(job);

    if (mockIds) {
      await this.jobMockRepo.delete({ jobId: job.id });
      if (mockIds.length) {
        job = await this.addMocksToJob(job, mockIds);
      }
    }

    return job;
  }

  async deleteJob(jobId: string, user: User) {
    const job = await this.jobRepo.findOne({
      where: { id: jobId },
    });

    if (!job)
      throw new HttpException('Job Not Found', StatusCodeEnum.JOB_NOT_FOUND);

    this.validateJobUser(job, user);

    const isInUse =
      job.status === JobStatusEnum.ACTIVE ||
      (await this.jobMockRepo.count({ where: { jobId: job.id } })) > 0;

    if (isInUse)
      throw new HttpException('Job is in use', StatusCodeEnum.FORBIDDEN);

    await this.jobRepo.remove(job);

    return true;
  }

  // ------------------------------- PRIVATE METHODS --------------------------------------- //
  private async addMocksToJob(job: Job, mockIds: string[]) {
    const mockCount = await this.mockRepo.count({
      where: { id: In(mockIds) },
    });

    if (mockCount !== mockIds.length)
      throw new HttpException('Mock Not Found', StatusCodeEnum.MOCK_NOT_FOUND);

    const jobMockData = mockIds.map((mockId) => ({
      jobId: job.id,
      mockId,
    }));

    const jobMocks = await this.jobMockRepo.save(jobMockData);

    job.jobMocks = jobMocks;

    return job;
  }

  private validateDateRange(startDate: number, endDate: number) {
    if (endDate < startDate) {
      throw new HttpException(
        'End date must be greater than start date',
        StatusCodeEnum.BAD_REQUEST,
      );
    }

    if (endDate < new Date().getTime()) {
      throw new HttpException(
        'End date must be greater than current date',
        StatusCodeEnum.BAD_REQUEST,
      );
    }
  }

  private validateJobUser(job: Job, user: User) {
    if (job.companyId !== user.companyUser.companyId) {
      throw new HttpException(
        'You can not access this mock',
        StatusCodeEnum.FORBIDDEN,
      );
    }
  }
}
