import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mock } from './entities/mock.entity';
import { MockController } from './controllers/mock.controller';
import { MockService } from './services/mock.service';
import { MockQuestion } from './entities/mock-question.entity';
import { User } from '../auth-base/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mock, MockQuestion, User])],
  controllers: [MockController],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
