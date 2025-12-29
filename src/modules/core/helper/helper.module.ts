import { Global, Module } from '@nestjs/common';
import { AppHelperService } from './helper.services';
import { AuthHelperService } from './auth-helper.service';

@Global()
@Module({
  providers: [AppHelperService, AuthHelperService],
  exports: [AppHelperService, AuthHelperService],
})
export class HelperModule {}
