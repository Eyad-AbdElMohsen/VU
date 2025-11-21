import { FileModelNameEnum } from "../enums/file-model.enum";

export const FileSizeRules = {
    [FileModelNameEnum.USER]: 5 * 1024 * 1024,
    [FileModelNameEnum.COMPANY]: 10 * 1024 * 1024,
};

export const AllowedMimeTypes = {
    [FileModelNameEnum.USER]: ['image/jpeg', 'image/png', 'image/webp'],
    [FileModelNameEnum.COMPANY]: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};
