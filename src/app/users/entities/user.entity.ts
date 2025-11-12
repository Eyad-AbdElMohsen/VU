import { BaseModel } from "src/config/database/base-model";
import { Column, Entity } from "typeorm";
import { UserTypeEnum } from "../enums/user.enum";


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
}

