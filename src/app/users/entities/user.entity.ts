import { BaseModel } from 'src/config/database/base-model';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserTypeEnum } from '../enums/user.enum';
import { Company } from 'src/app/companies/entities/company.entity';

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

  // should be in staff data
  // @Column({ default: false })
  // approvedByManager: boolean

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.USER })
  userType: UserTypeEnum;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @ManyToOne(() => Company, (company) => company.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: string;

  @OneToOne(() => Company, (company) => company.manager, { nullable: true })
  ownedCompany: Company;
}
