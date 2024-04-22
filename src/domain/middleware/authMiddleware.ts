import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../users/users.service';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      throw new HttpException('unauthorize user', HttpStatus.UNAUTHORIZED);
    }

    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = verify(token, 'jwtusageonly');

    const user = await this.userService.findByCridential(decode.username);

    req.user = user;
    next();
  }
}
