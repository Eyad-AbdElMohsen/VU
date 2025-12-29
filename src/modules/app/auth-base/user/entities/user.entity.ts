import { BaseModel } from 'src/common/database/base-model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserTypeEnum } from '../enums/user.enum';
import { Company } from '../../../companies/entities/company.entity';
import { SessionEntity } from '../../session/entities/session.entity';
import { CompanyUser } from 'src/modules/app/companies/entities/company-user.entity';

@Entity()
export class User extends BaseModel {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.USER })
  userType: UserTypeEnum;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ nullable: true })
  companyId: string;

  @OneToOne(() => Company, (company) => company.manager, { nullable: true })
  ownedCompany: Company;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => CompanyUser, (companyUser) => companyUser.company)
  companyUsers: CompanyUser[];
}
