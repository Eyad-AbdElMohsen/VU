import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyIndustryEnum } from '../enums/company-industry.enum';
import { CompanyUser } from './company-user.entity';
import { Mock } from '../../mocks/entities/mock.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Candidate } from '../../candidates/entities/candidate.entity';

@Entity()
export class Company extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: CompanyIndustryEnum })
  industry: CompanyIndustryEnum;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  managerId: string;

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company)
  companyUsers: CompanyUser[];

  @OneToMany(() => Mock, (mock) => mock.company)
  mocks: Mock[];

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => Candidate, (candidate) => candidate.company)
  candidates: Candidate[];
}
