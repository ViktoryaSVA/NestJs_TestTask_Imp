import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from '@app/user/user.service';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly userService: UserService) {};

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decoded: JwtPayload = verify(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await this.userService.findById(decoded.id);

      const isBlacklisted = await this.userService.checkTokenBlacklist(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token is in blacklist');
      }

      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next(err);
    }
  }
}