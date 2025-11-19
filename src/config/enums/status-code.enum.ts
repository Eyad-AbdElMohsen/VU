import { HttpStatus } from '@nestjs/common';

export const StatusCodeEnum = {
  ...HttpStatus,
  ALREADY_EXIST: 600,
  INVALID_PASSWORD: 601,
  MISSING_JWT_SECRET: 602,
  BAD_CREDENTIALS: 603,
  ALREADY_VERIFIED: 604,
};
