import { Global, Module } from '@nestjs/common';
import { HelperService } from './helper.services';

@Global()
@Module({
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
