import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    // console.log('check request', req);
    // console.log('check user: ', req.headers);
    const { refreshtoken } = req.headers;
    const token = this.getToken(refreshtoken);
    if (!token) {
      throw new UnauthorizedException('Not have refresh token, please login');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_SECRET,
      });
      req['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException('Please login again');
    }

    return true;
  }
  private getToken = (authToken: string): string => {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new HttpException(
        {
          message:
            'Invalid Authorization token - Token does not match Bearer .*',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return match[1];
  };
}
