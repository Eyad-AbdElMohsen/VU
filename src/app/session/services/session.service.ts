import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";
import { SessionEntity } from "../entities/session.entity";

@Injectable()
export class SessionService {
  constructor(@InjectRepository(SessionEntity) private readonly sessionRepo: Repository<SessionEntity>) { }

  async createNewSession(userId: string): Promise<SessionEntity> {
    return await this.sessionRepo.save({
      userId
    })
  }
}