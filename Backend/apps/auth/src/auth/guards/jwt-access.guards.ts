import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accesstoken = req.cookies['access_token'];
    const token = this.getToken(accesstoken);
    if (!token) {
      throw new GraphQLError('Please login again', {
        extensions: {
          errorCode: '5001-3',
        },
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_SECRET,
      });
      req['user'] = payload;
    } catch (err) {
      throw err;
    }

    return true;
  }
  private getToken = (authToken: string): string => {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new GraphQLError(
        'Invalid Authorization token - Token does not match Bearer .*',
        {
          extensions: {
            errorCode: '5001-4',
          },
        },
      );
    }
    return match[1];
  };
}
