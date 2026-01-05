import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mock } from '../entities/mock.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateMockInput } from '../inputs/create-mock.input';
import { MockQuestion } from '../entities/mock-question.entity';
import { UpdateMockInput } from '../inputs/update-mock.input';
import { StatusCodeEnum } from 'src/common/enums/status-code.enum';
import { User } from '../../auth-base/user/entities/user.entity';
import { PaginatedMockQueryInput } from '../inputs/paginated-mock-query.input';
import { AppHelperService } from 'src/modules/core/helper/helper.services';
import { PaginatedResponse } from 'src/common/types/paginated-response.type';

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(Mock) private readonly mockRepo: Repository<Mock>,
    @InjectRepository(MockQuestion)
    private readonly mockQuestionRepo: Repository<MockQuestion>,
    private readonly appHelper: AppHelperService,
  ) {}

  async getMock(mockId: string, user: User) {
    const mock = await this.mockRepo.findOne({
      where: { id: mockId },
      relations: { questions: true },
    });

    if (!mock)
      throw new HttpException('Mock Not Found', StatusCodeEnum.MOCK_NOT_FOUND);

    this.validateMockUser(mock, user);

    return mock;
  }

  async getPaginatedMocks(
    query: PaginatedMockQueryInput,
    user: User,
  ): Promise<PaginatedResponse<Mock>> {
    const companyId = user.companyUser.companyId;
    const { filter, paginate } = query;

    const where: FindOptionsWhere<Mock>[] = [{ companyId }];

    if (filter) {
      if (filter.search) {
        const search = `%${this.appHelper.trimAllSpaces(filter.search)}%`;
        where.push({
          title: ILike(search),
          description: ILike(search),
          topics: ILike(search),
          technologies: ILike(search),
        });
      }

      if (filter.difficulty) where.push({ difficulty: filter.difficulty });

      if (filter.type) where.push({ type: filter.type });

      if (filter.enableFollowUpQuestions)
        where.push({ enableFollowUpQuestions: filter.enableFollowUpQuestions });

      if (filter.enableRecordReplay)
        where.push({ enableRecordReplay: filter.enableRecordReplay });
    }

    const page = paginate?.page || 1,
      limit = paginate?.limit || 10;

    const [items, total] = await this.mockRepo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: { questions: true },
    });

    return {
      items,
      total,
      hasNext: total > page * limit,
      hasPrevious: page > 1,
    };
  }

  async createMock(input: CreateMockInput, user: User) {
    const { questions, ...mock } = input;

    //TODO: check about jobs when added in input

    const newMock = this.mockRepo.create({
      ...mock,
      companyId: user.companyUser.companyId,
    });
    await this.mockRepo.save(newMock);

    const newQuestionsData = questions.map((question) => ({
      ...question,
      mockId: newMock.id,
    }));

    const newQuestions = await this.mockQuestionRepo.save(newQuestionsData);

    newMock.questions = newQuestions;

    return newMock;
  }

  async updateMock(input: UpdateMockInput, user: User) {
    const { mockId, questions, ...mockData } = input;

    const mock = await this.mockRepo.findOne({
      where: { id: mockId },
    });

    if (!mock)
      throw new HttpException('Mock Not Found', StatusCodeEnum.MOCK_NOT_FOUND);

    this.validateMockUser(mock, user);

    Object.assign(mock, mockData);
    await this.mockRepo.save(mock);

    // if questions is null or undefined, no update
    // else, remove old question and add new questions
    if (questions) {
      await this.mockQuestionRepo.delete({ mockId });

      if (questions.length) {
        const newQuestionsData = questions.map((question) => ({
          ...question,
          mockId: mockId,
        }));

        await this.mockQuestionRepo.save(newQuestionsData);
      }
    }

    return mock;
  }

  async deleteMock(mockId: string, user: User) {
    const mock = await this.mockRepo.findOne({
      where: { id: mockId },
    });

    //TODO: check about jobs and prevent deleting if exist

    if (!mock)
      throw new HttpException('Mock Not Found', StatusCodeEnum.MOCK_NOT_FOUND);

    this.validateMockUser(mock, user);

    await this.mockRepo.delete(mockId);
    return true;
  }
  private validateMockUser(mock: Mock, user: User) {
    if (mock.companyId !== user.companyUser.companyId)
      throw new HttpException(
        'You can not access this mock',
        StatusCodeEnum.FORBIDDEN,
      );
  }
}
