import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { JobTypeEnum } from '../enums/job-type.enum';
import { JobStatusEnum } from '../enums/job-status.enum';
import { JobMock } from './job-mock.entity';

@Entity()
export class Job extends BaseModel {
  @ManyToOne(() => Company, (company) => company.jobs)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: JobTypeEnum })
  type: JobTypeEnum;

  @Column({ type: 'simple-array' })
  departments: string[];

  @Column({ type: 'text' })
  requirements: string;

  @Column({ type: 'boolean', default: true })
  sendEmailToCandidates: boolean;

  @Column({ type: 'boolean', default: true })
  shareFeedback: boolean;

  @Column({ type: 'timestamp without time zone' })
  startDate: Date;

  @Column({ type: 'timestamp without time zone' })
  endDate: Date;

  @Column({ type: 'enum', enum: JobStatusEnum })
  status: JobStatusEnum;

  @OneToMany(() => JobMock, (jobMock) => jobMock.job)
  jobMocks: JobMock[];
}
