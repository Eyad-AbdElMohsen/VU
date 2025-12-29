import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileModelNameEnum } from '../enums/file-model.enum';
import { join } from 'path';
import * as fs from 'fs';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file: Express.Multer.File, modelName: FileModelNameEnum) {
    const finalName = `${Date.now()}-${file.originalname}`;

    const savePath = join(process.cwd(), 'public', modelName);
    await fs.promises.mkdir(savePath, { recursive: true });

    const fullFilePath = join(savePath, finalName);
    fs.writeFileSync(fullFilePath, file.buffer);

    const url = `${modelName}/${finalName}`;

    const newFile = this.fileRepository.create({
      name: finalName,
      hasReferenceAtDatabase: false,
      modelName,
      mimeType: file.mimetype,
      size: file.size,
      url,
    });

    return this.fileRepository.save(newFile);
  }
}
