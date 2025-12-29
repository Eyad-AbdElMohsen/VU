import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyIndustryEnum } from '../enums/company-industry.enum';
import { User } from '../../auth-base/user/entities/user.entity';

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

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToOne(() => User, (user) => user.ownedCompany, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  managerId: string;
}
