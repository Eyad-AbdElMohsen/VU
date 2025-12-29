import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { StatusCodeEnum } from 'src/config/enums/status-code.enum';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/app/auth-base/user/entities/user.entity';
@Injectable()
export class AuthHelperService {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(inputPassword: string, userPassword: string) {
    return await bcrypt.compare(inputPassword, userPassword);
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

    const payload: jwt.JwtPayload = { sessionId };

    return jwt.sign(payload, secret, { expiresIn });
  }

  appendAuthTokenToUser(user: User, token: string) {
    return {
      ...user,
      token,
    };
  }

  extractTokenFromHeaders(req: Request) {
    const { authorization } = req.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return token;
  }

  validateTokenAndReturnPayload(token: string): jwt.JwtPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new HttpException(
        'Missing JWT Secret',
        StatusCodeEnum.MISSING_JWT_SECRET,
      );
    }

    try {
      const payload = jwt.verify(token, secret);

      if (!payload || typeof payload !== 'object')
        throw new UnauthorizedException('Invalid token payload');

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
