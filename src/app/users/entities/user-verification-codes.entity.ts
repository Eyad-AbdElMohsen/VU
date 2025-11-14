import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseModel } from 'src/config/database/base-model';
import { UserVerificationCodeUseCaseEnum } from '../enums/user-verification-code.enum';

@Entity()
export class UserVerificationCode extends BaseModel {
  @Column()
  code: string;

  @Column({ type: 'timestamp' })
  expireAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string

  @Column({
    type: 'enum',
    enum: UserVerificationCodeUseCaseEnum
  })
  useCase: UserVerificationCodeUseCaseEnum
}