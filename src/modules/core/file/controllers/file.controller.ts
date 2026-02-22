import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileModelNameEnum } from '../enums/file-model.enum';
import { FileValidationInterceptor } from '../interceptors/file-size-validation.pipe';
import { FileEntity } from '../entities/file.entity';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), FileValidationInterceptor)
  async uploadFile(
    @Body('modelName') modelName: FileModelNameEnum,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    return this.fileService.uploadFile(file, modelName);
  }
}
