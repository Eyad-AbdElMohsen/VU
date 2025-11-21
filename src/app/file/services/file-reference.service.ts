import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { In, Repository } from 'typeorm';
import { FileModelNameEnum } from '../enums/file-model.enum';

@Injectable()
export class FileReferenceService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async markFilesAsReferenced(
    fileIds: string[],
    modelName: FileModelNameEnum,
  ): Promise<void> {
    const files = await this.fileRepository.find({
      where: {
        id: In(fileIds),
      },
    });

    if (fileIds.length !== files.length) {
      throw new BadRequestException('One or more files do not exist.');
    }

    for (const file of files) {
      if (file.modelName !== modelName)
        throw new BadRequestException(
          `File with ID ${file.id} does not belong to model ${modelName}.`,
        );

      file.hasReferenceAtDatabase = true;
    }

    await this.fileRepository.save(files);
  }

  async unmarkFilesAsReferenced(fileIds: string[]): Promise<void> {
    const files = await this.fileRepository.find({
      where: {
        id: In(fileIds),
      },
    });

    for (const file of files) {
      file.hasReferenceAtDatabase = false;
    }

    await this.fileRepository.save(files);
  }
}
