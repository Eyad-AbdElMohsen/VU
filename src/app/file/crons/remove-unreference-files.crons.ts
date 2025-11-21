
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class RemoveUnreferenceFiles {
    private readonly logger = new Logger(RemoveUnreferenceFiles.name);
    constructor(@InjectRepository(FileEntity) private readonly fileRepo: Repository<FileEntity>) { }

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleCron() {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const unReferencedFiles = await this.fileRepo.find({
            where: {
                hasReferenceAtDatabase: false,
                createdAt: LessThan(twoHoursAgo),
            },
        });

        for (const file of unReferencedFiles) {
            try {
                const filePath = require('path').join(process.cwd(), 'public', file.url);
                await require('fs').promises.unlink(filePath);
                this.logger.debug(`Removed unreferenced file: ${file.url}`);
            } catch (error) {
                this.logger.error(`Failed to remove file: ${file.url}`, error.stack);
            }
        }

        await this.fileRepo.delete({
            hasReferenceAtDatabase: false,
            createdAt: LessThan(twoHoursAgo),
        });
    }
}
