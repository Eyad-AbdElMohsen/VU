import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class CandidateQuestion extends BaseModel {
  @ManyToOne(() => Candidate, (candidate) => candidate.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @Column()
  candidateId: string;

  @Column({ type: 'text' })
  question: string;

  @Column()
  durationInMinutes: number;

  @Column()
  answer: string;

  @Column({ type: 'text' })
  aiFeedback: string;

  @Column({ type: 'simple-array' })
  strength: string[];

  @Column({ type: 'simple-array' })
  areasToImprove: string[];

  @Column()
  score: number;
}
