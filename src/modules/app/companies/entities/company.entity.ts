import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyIndustryEnum } from '../enums/company-industry.enum';
import { User } from '../../auth-base/user/entities/user.entity';
import { CompanyUser } from './company-user.entity';
import { Mock } from '../../mocks/entities/mock.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Company extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: CompanyIndustryEnum })
  industry: CompanyIndustryEnum;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true }) // TODO: Review similar cases and do migration if needed
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
}
