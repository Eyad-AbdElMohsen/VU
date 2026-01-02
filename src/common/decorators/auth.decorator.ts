import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthOptions } from '../types/auth.type';
import { AuthGuard } from '../guards/auth.guard';
import { USER_TYPES_KEY } from '../constants/user-type-key';

export function Auth(options: AuthOptions = {}) {
  const { types = [] } = options;

  return applyDecorators(
    UseGuards(AuthGuard),
    ...(types.length ? [SetMetadata(USER_TYPES_KEY, types)] : []),
  );
}
