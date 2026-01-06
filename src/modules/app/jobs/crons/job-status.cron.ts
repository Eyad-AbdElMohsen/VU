import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { JobStatusEnum } from '../enums/job-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobStatusCron {
  constructor(
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async updateJobStatus() {
    const now = new Date();
    const jobs = await this.jobRepo.find();

    for (const job of jobs) {
      if (job.endDate < now) {
        job.status = JobStatusEnum.CLOSED;
      } else if (job.startDate < now) {
        job.status = JobStatusEnum.ACTIVE;
      } else {
        job.status = JobStatusEnum.SCHEDULED;
      }
    }

    await this.jobRepo.save(jobs);
  }
}
