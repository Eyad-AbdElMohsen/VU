import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobService } from './services/job.service';
import { JobMock } from './entities/job-mock.entity';
import { JobController } from './controllers/job.controller';
import { Mock } from '../mocks/entities/mock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobMock, Mock])],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
