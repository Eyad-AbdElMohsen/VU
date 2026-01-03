import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Mock } from './mock.entity';
import { DifficultyEnum } from '../enums/difficulty.enum';
import { AnswerTypeEnum } from '../enums/question-answer-type.enum';

@Entity()
export class MockQuestion extends BaseModel {
  @ManyToOne(() => Mock, (mock) => mock.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mockId' })
  mock: Mock;

  @Column()
  mockId: string;

  @Column({ type: 'text' })
  questionTitle: string;

  @Column({ type: 'text' })
  questionDescription: string;

  @Column({ type: 'enum', enum: DifficultyEnum })
  difficulty: DifficultyEnum;

  @Column({ type: 'int' })
  estimatedTimeInMinutes: number;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'enum', enum: AnswerTypeEnum })
  answerType: AnswerTypeEnum;

  @Column({ type: 'text' })
  correctAnswer: string;
}
