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
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'), FileValidationInterceptor)
  @ApiOperation({ summary: 'Upload a file and attach it to a target model' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['modelName', 'file'],
      properties: {
        modelName: {
          type: 'string',
          enum: Object.values(FileModelNameEnum),
          example: FileModelNameEnum.USER,
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: FileEntity })
  async uploadFile(
    @Body('modelName') modelName: FileModelNameEnum,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    return this.fileService.uploadFile(file, modelName);
  }
}
