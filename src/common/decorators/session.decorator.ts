import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppRequest } from '../types/request.type';

export const CurrentSessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const sessionId = request.sessionId;

    if (!sessionId) {
      throw new InternalServerErrorException('sessionId not found in request');
    }

    return sessionId;
  },
);
