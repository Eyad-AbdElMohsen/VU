import { HttpException, Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodeEnum } from "src/config/enums/status-code.enum";
import { User } from "../users/entities/user.entity";
import { Response } from "express";

@Injectable()
export class HelperService {
  constructor() { }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  createRandomCodeNumber(length: number) {
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
  }

  generateJwtToken(sessionId: number) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new HttpException("Missing JWT Secret", StatusCodeEnum.MISSING_JWT_SECRET)
    }
    const expiresIn = '1d';

    return jwt.sign({ sessionId }, secret, { expiresIn });
  }

  appendAuthTokenToUser(user: User, token: string, res: Response) {
    res.setHeader('token', token);

    return Object.assign(user, {
      token,
    });
  }
}