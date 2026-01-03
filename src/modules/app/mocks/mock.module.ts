import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mock } from './entities/mock.entity';
import { MockController } from './controllers/mock.controller';
import { MockService } from './services/mock.service';
import { MockQuestionService } from './services/mock-question.service';
import { MockQuestion } from './entities/mock-question.entity';
import { MockQuestionController } from './controllers/mock-question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mock, MockQuestion])],
  controllers: [MockController, MockQuestionController],
  providers: [MockService, MockQuestionService],
  exports: [MockService, MockQuestionService],
})
export class MockModule {}
