import { User } from "src/app/users/entities/user.entity";
import { MinModel } from "src/config/database/min-model";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity()
export class SessionEntity extends MinModel {
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string
}