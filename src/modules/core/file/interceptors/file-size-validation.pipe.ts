import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileModelValidation } from '../types/file-validation.types';
import { FileModelNameEnum } from '../enums/file-model.enum';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const file = req.file;
    const body = req.body;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const modelName = body.modelName as FileModelNameEnum;

    if (!modelName) {
      throw new BadRequestException('Model name is required');
    }

    const rules = FileModelValidation[modelName];

    if (!rules.maxSize) {
      throw new BadRequestException(`Invalid file model: ${modelName}`);
    }

    if (file.size > rules.maxSize) {
      throw new BadRequestException(
        `File too large. Max size for ${modelName} is ${rules.maxSize} bytes`,
      );
    }

    const mimeType = file.mimetype;

    if (!rules.allowMimeTypes.includes(mimeType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types for ${modelName} are: ${rules.allowMimeTypes.join(', ')}`,
      );
    }

    return next.handle();
  }
}
