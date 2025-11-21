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

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), FileValidationInterceptor)
  async uploadFile(
    @Body('modelName') modelName: FileModelNameEnum,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.uploadFile(file, modelName);
  }
}
