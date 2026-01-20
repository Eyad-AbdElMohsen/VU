import { IsEnum, IsIn } from 'class-validator';
import { CandidateStatusEnum } from '../enums/candidate-status.enum';

export class UpdateCandidateStatusInput {
  @IsEnum(CandidateStatusEnum)
  @IsIn([CandidateStatusEnum.ACCEPTED, CandidateStatusEnum.REJECTED])
  status: CandidateStatusEnum;
}
