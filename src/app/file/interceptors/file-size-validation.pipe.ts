import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  AllowedMimeTypes,
  FileSizeRules,
} from '../types/file-validation.types';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const file = req.file;
    const body = req.body;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const modelName = body.modelName;

    if (!modelName) {
      throw new BadRequestException('Model name is required');
    }

    const maxSize = FileSizeRules[modelName];

    if (!maxSize) {
      throw new BadRequestException(`Invalid file model: ${modelName}`);
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Max size for ${modelName} is ${maxSize} bytes`,
      );
    }

    const mimeType = file.mimetype;
    const allowedMimeTypes = AllowedMimeTypes[modelName];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types for ${modelName} are: ${allowedMimeTypes.join(', ')}`,
      );
    }

    return next.handle();
  }
}
