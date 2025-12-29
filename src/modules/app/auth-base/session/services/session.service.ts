import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  async createNewSession(userId: string): Promise<SessionEntity> {
    return await this.sessionRepo.save({
      userId,
    });
  }

  // If sessionId is undefined, it will terminate all user sessions
  async deleteUserSessions(userId: string, sessionId?: number) {
    await this.sessionRepo.delete({
      userId,
      ...(sessionId && { id: sessionId }),
    });

    return true;
  }
}
