import { BaseModel } from "src/config/database/base-model";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserTypeEnum } from "../enums/user.enum";
import { Company } from "src/app/companies/entities/company.entity";


@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.USER })
  userType: UserTypeEnum

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @ManyToOne(() => Company, (company) => company.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: string
}

