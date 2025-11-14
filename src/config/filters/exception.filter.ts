import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { ErrorResponse } from '../types/error-response.type'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | any = 'Internal Server Error';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errorName = (exceptionResponse as any).error || exception.name;
      }
    }

    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.formatValidationErrors([exception]);
      errorName = 'ValidationError';
    }

    // Array of validation errors
    else if (
      Array.isArray(exception) &&
      exception.length > 0 &&
      exception[0] instanceof ValidationError
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = this.formatValidationErrors(exception as ValidationError[]);
      errorName = 'ValidationError';
    }

    else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || message;
      errorName = exception.name;
    }


    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: errorName
    };

    if (status >= 500 || process.env.NODE_ENV === 'development') {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((err) =>
      err.constraints ? Object.values(err.constraints) : [`Invalid value for ${err.property}`],
    );
  }
}