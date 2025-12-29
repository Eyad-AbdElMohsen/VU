import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth-base/user/entities/user.entity';
import { Company } from './company.entity';
import { MinModel } from 'src/common/database/min-model';
import { CompanyUserTypeEnum } from '../enums/company-user-type.enum';

@Entity()
export class CompanyUser extends MinModel {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.companyUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.companyUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @Column({
    type: 'enum',
    enum: CompanyUserTypeEnum,
    default: CompanyUserTypeEnum.VIEWER,
  })
  type: CompanyUserTypeEnum;
}
