import { Controller } from '@nestjs/common';
import { MockService } from '../services/mock.service';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}
}
