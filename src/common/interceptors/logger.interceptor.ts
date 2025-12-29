import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_REQUEST');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      // finalize runs after either success or error
      finalize(() => {
        const duration = Date.now() - now;
        const logMessage = `METHOD - ${req.method} 
| URL - ${req.url} 
| PARAMS - ${JSON.stringify(req.params)} 
| BODY - ${JSON.stringify(req.body)} 
| ${duration} ms
        `;
        req.url && this.logger.log(logMessage);
      }),
    );
  }
}
