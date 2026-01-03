import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mock } from '../entities/mock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(Mock) private readonly mockRepo: Repository<Mock>,
  ) {}
}
