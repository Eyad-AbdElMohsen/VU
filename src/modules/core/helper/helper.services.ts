import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { StatusCodeEnum } from 'src/config/enums/status-code.enum';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';

@Injectable()
export class HelperService {
  constructor() {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(inputPassword: string, userPassword: string) {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  createRandomCodeNumber(length: number) {
    return Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, length);
  }

  async generateJwtToken(sessionId: number) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new HttpException(
        'Missing JWT Secret',
        StatusCodeEnum.MISSING_JWT_SECRET,
      );
    }
    const expiresIn = '1d';

    return jwt.sign({ sessionId }, secret, { expiresIn });
  }

  appendAuthTokenToUser(user: User, token: string) {
    return {
      ...user,
      token,
    };
  }
}
