import { FileModelNameEnum } from '../enums/file-model.enum';

export type FileModelValidationType = {
  [K in FileModelNameEnum]: {
    maxSize: number;
    allowMimeTypes: string[];
  };
};

export const FileModelValidation: FileModelValidationType = {
  user: {
    maxSize: 5 * 1024 * 1024,
    allowMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  company: {
    maxSize: 10 * 1024 * 1024,
    allowMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
  },
};
