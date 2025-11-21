import { BaseModel } from "src/config/database/base-model";
import { Column, Entity } from "typeorm";
import { FileModelNameEnum } from "../enums/file-model.enum";

@Entity()
export class FileEntity extends BaseModel {
    @Column({ nullable: true })
    url: string;

    @Column({ type: 'enum', enum: FileModelNameEnum })
    modelName: FileModelNameEnum;

    @Column()
    name: string;

    @Column({ nullable: true })
    mimeType?: string

    @Column({ nullable: true })
    size?: number;

    @Column({ nullable: false, default: false })
    hasReferenceAtDatabase: boolean;
}