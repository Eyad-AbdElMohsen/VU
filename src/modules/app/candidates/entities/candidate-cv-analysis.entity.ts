import { BaseModel } from 'src/common/database/base-model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity()
export class CandidateCvAnalysis extends BaseModel {
  @OneToOne(() => Candidate, (candidate) => candidate.analysis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @Column()
  candidateId: string;

  @Column({ type: 'simple-array' })
  skills: string[];

  @Column({ type: 'text' })
  summary: string;

  @Column()
  score: number;
}
