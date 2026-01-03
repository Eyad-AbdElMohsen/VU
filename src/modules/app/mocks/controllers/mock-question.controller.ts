import { Controller } from '@nestjs/common';
import { MockQuestionService } from '../services/mock-question.service';

@Controller('mock-question')
export class MockQuestionController {
  constructor(private readonly mockQuestionService: MockQuestionService) {}
}
