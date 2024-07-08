import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    const isValidApiKey = apiKey === 'eminem';

    if (!isValidApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}

export default AuthMiddleware;
