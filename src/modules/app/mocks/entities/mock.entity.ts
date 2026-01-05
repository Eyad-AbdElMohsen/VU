import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { MockTypeEnum } from '../enums/mock-type.enum';
import { BaseModel } from 'src/common/database/base-model';
import { MockQuestion } from './mock-question.entity';
import { DifficultyEnum } from '../enums/difficulty.enum';

@Entity()
@Unique(['title', 'companyId'])
export class Mock extends BaseModel {
  @ManyToOne(() => Company, (company) => company.mocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: DifficultyEnum })
  difficulty: DifficultyEnum;

  @Column({ type: 'enum', enum: MockTypeEnum })
  type: MockTypeEnum;

  @Column({ type: 'int' })
  estimatedTimeInMinutes: number;

  @Column({ type: 'simple-array' })
  technologies: string[];

  @Column({ type: 'simple-array' })
  topics: string[];

  @Column({ type: 'boolean', default: false })
  enableFollowUpQuestions: boolean;

  @Column({ type: 'boolean', default: false })
  enableRecordReplay: boolean;

  @OneToMany(() => MockQuestion, (mockQuestion) => mockQuestion.mock)
  questions: MockQuestion[];
}
