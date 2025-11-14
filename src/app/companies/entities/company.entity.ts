import { User } from "src/app/users/entities/user.entity";
import { BaseModel } from "src/config/database/base-model";
import { Column, Entity, OneToMany } from "typeorm";
import { CompanyIndustryEnum } from "../enums/company-industry.enum";


@Entity()
export class Company extends BaseModel {
  @Column()
  name: string

  @Column({ type: 'enum', enum: CompanyIndustryEnum })
  industry: CompanyIndustryEnum

  @Column({ nullable: true })
  website: string

  @Column({ nullable: true })
  logoUrl: string

  @Column({ nullable: true })
  phone: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @OneToMany(() => User, (user) => user.company)
  users: User[]

}