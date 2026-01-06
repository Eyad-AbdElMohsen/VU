import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { Mock } from '../../mocks/entities/mock.entity';

@Entity()
export class JobMock extends BaseModel {
  @ManyToOne(() => Job, (job) => job.jobMocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: string;

  @ManyToOne(() => Mock, (mock) => mock.mockJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mockId' })
  mock: Mock;

  @Column()
  mockId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
