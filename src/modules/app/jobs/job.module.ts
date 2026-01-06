import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobService } from './services/job.service';
import { JobMock } from './entities/job-mock.entity';
import { JobController } from './controllers/job.controller';
import { Mock } from '../mocks/entities/mock.entity';
import { User } from '../auth-base/user/entities/user.entity';
import { JobMockController } from './controllers/job-mock.controller';
import { JobMockService } from './services/job-mock.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobMock, Mock, User])],
  controllers: [JobController, JobMockController],
  providers: [JobService, JobMockService],
  exports: [JobService, JobMockService],
})
export class JobModule {}
