import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserTypeEnum } from 'src/modules/app/auth-base/user/enums/user.enum';
import { AuthHelperService } from 'src/modules/core/helper/auth-helper.service';
import { TYPES_KEY } from '../constants/user-type-key';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AppRequest } from '../types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authHelperService: AuthHelperService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const allowedTypes = this.reflector.getAllAndOverride<UserTypeEnum[]>(
      TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req: AppRequest = context.switchToHttp().getRequest();

    const token = this.authHelperService.extractTokenFromHeaders(req);

    const { sessionId } =
      this.authHelperService.validateTokenAndReturnPayload(token);

    const user = await this.getUserBySessionId(sessionId);

    if (allowedTypes?.length && !allowedTypes.includes(user.userType)) {
      throw new ForbiddenException('You can not perform this action');
    }

    req.user = user;
    req.sessionId = sessionId;
    return true;
  }

  async getUserBySessionId(sessionId: number) {
    const user = await this.userRepo.findOne({
      where: {
        sessions: { id: sessionId },
      },
    });

    if (!user) {
      throw new NotFoundException('No User Found With this Session');
    }

    return user;
  }
}
