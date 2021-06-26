import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { User } from 'src/db/entities/user.entity';
import { pick } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization || '';
    const token = header.split(/\s+/).pop() || '';
    const auth = Buffer.from(token, 'base64').toString();
    const parts = auth.split(/:/);
    const user_id = parts.shift();
    const password = parts.join(':');
    if (header && header.split(' ')[0] === 'Basic') {
      const user = await User.findOne({ user_id });

      if (user) {
        const authenticated = await user.validatePassword(password);
        if (authenticated) {
          request.user = pick(user, ['id', 'user_id', 'nickname']);
          return authenticated;
        } else {
          throw new UnauthorizedException({
            message: 'Authentication Faild',
          });
        }
      } else {
        throw new UnauthorizedException({
          message: 'Authentication Faild',
        });
      }
    } else {
      throw new UnauthorizedException({
        message: 'Authentication Faild',
      });      
    }
  }
}
