import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../entities/candidate.entity';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { User } from '../../auth-base/user/entities/user.entity';
import { StatusCodeEnum } from 'src/common/enums/status-code.enum';
import { PaginatedCandidateQueryInput } from '../inputs/paginated-candidate-query.input';
import { PaginatedResponse } from 'src/common/types/paginated-response.type';
import { AppHelperService } from 'src/modules/core/helper/helper.services';
import { UpdateCandidateStatusInput } from '../inputs/update-candidate-status.input';
import { SortDirectionEnum } from 'src/common/enums/sort.enum';
import { CandidateSortFieldsEnum } from '../enums/candidate-sort-fields.enum';
import { ApplyForJobInput } from '../inputs/apply-for-job.input';
import { Job } from '../../jobs/entities/job.entity';
import { Company } from '../../companies/entities/company.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    private readonly appHelper: AppHelperService,
  ) {}

  async applyForJob(companyId: string, jobId: string, input: ApplyForJobInput): Promise<boolean> {
    const { name, email, cvUrl } = input;

    let candidate = this.candidateRepo.create({
      // QUES: should I add job and company?
      jobId,
      companyId,
      name,
      email,
      cvUrl,
    });
    
    await this.candidateRepo.save(candidate);

    return true;
  }

  async getCandidate(candidateId: string, user: User) {
    const candidate = await this.candidateRepo.findOne({
      where: { id: candidateId },
    });

    if (!candidate)
      throw new HttpException(
        'Candidate Not Found',
        StatusCodeEnum.CANDIDATE_NOT_FOUND,
      );

    this.validateCandidateUser(candidate, user);

    return candidate;
  }

  async getPaginatedCandidates(
    query: PaginatedCandidateQueryInput,
    user: User,
  ): Promise<PaginatedResponse<Candidate>> {
    const companyId = user.companyUser.companyId;
    const { filter, paginate, sort } = query;

    const where: FindOptionsWhere<Candidate>[] = [{ companyId }];

    if (filter) {
      if (filter.search) {
        const search = `%${this.appHelper.trimAllSpaces(filter.search)}%`;
        where.push({
          name: ILike(search),
        });
      }

      if (filter.jobId) where.push({ jobId: filter.jobId });

      if (filter.status) where.push({ status: filter.status });

      if (filter.cheat) where.push({ performance: { cheat: filter.cheat } });

      if (filter.minScore !== undefined)
        where.push({
          performance: { score: MoreThanOrEqual(Math.ceil(filter.minScore)) },
        });

      if (filter.maxScore !== undefined)
        where.push({
          performance: { score: LessThanOrEqual(Math.floor(filter.maxScore)) },
        });
    }

    const page = paginate?.page || 1,
      limit = paginate?.limit || 10;

    const order: FindOptionsOrder<Candidate> = {};
    if (sort) {
      switch (sort.field) {
        case CandidateSortFieldsEnum.NAME:
          order.name = sort.dir || SortDirectionEnum.ASC;
          break;
        case CandidateSortFieldsEnum.SCORE:
          order.performance = { score: sort.dir || SortDirectionEnum.DESC };
          break;
        case CandidateSortFieldsEnum.CREATED_AT:
          order.createdAt = sort.dir || SortDirectionEnum.DESC;
          break;
        default:
          order.createdAt = SortDirectionEnum.DESC;
          break;
      }
    } else {
      order.createdAt = SortDirectionEnum.DESC;
    }

    const [items, total] = await this.candidateRepo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: { performance: true, analysis: true },
      order,
    });

    return {
      items,
      total,
      hasNext: total > page * limit,
      hasPrevious: page > 1,
    };
  }

  async updateCandidateStatus(
    // TODO: Need reply to the candidate when status is updated - one-time updatable
    candidateId: string,
    input: UpdateCandidateStatusInput,
    user: User,
  ) {
    const { status } = input;
    const candidate = await this.candidateRepo.findOne({
      where: { id: candidateId },
      relations: { performance: true },
    });
    if (!candidate)
      throw new HttpException(
        'Candidate Not Found',
        StatusCodeEnum.CANDIDATE_NOT_FOUND,
      );

    this.validateCandidateUser(candidate, user);

    candidate.status = status;
    await this.candidateRepo.save(candidate);

    return true;
  }

  // Private Methods
  private validateCandidateUser(candidate: Candidate, user: User) {
    if (candidate.companyId !== user.companyUser.companyId) {
      throw new HttpException(
        'You can not access this candidate',
        StatusCodeEnum.FORBIDDEN,
      );
    }
  }
}
