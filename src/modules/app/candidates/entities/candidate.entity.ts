import { BaseModel } from 'src/common/database/base-model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { CandidateQuestion } from './candidate-question.entity';
import { CandidateCvAnalysis } from './candidate-cv-analysis.entity';
import { CandidatePerfomance } from './candidate-perfomance.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class Candidate extends BaseModel {
  @ManyToOne(() => Job, (job) => job.candidates, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Company, (company) => company.candidates, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  jobId?: string;

  @Column({ nullable: true })
  companyId?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cvUrl: string;

  @OneToMany(() => CandidateQuestion, (question) => question.candidate)
  questions: CandidateQuestion[];

  @OneToOne(() => CandidateCvAnalysis, (analysis) => analysis.candidate)
  analysis: CandidateCvAnalysis;

  @OneToOne(() => CandidatePerfomance, (performance) => performance.candidate)
  performance: CandidatePerfomance;
}
