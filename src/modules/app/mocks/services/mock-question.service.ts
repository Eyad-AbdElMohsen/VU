import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MockQuestion } from '../entities/mock-question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MockQuestionService {
  constructor(
    @InjectRepository(MockQuestion)
    private readonly mockQuestionRepo: Repository<MockQuestion>,
  ) {}
}
