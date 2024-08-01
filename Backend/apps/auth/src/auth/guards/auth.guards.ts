import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { UsersService } from '../../users/users.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class AuthUserGuard implements CanActivate {
  //   constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    // console.log('check request', req);
    // console.log('check user: ', req.headers);
    const { islogin } = req.headers;
    if (islogin) {
      return true;
    }
    throw new AuthenticationError(
      'Could not authenticate with token or user does not have permissions',
    );
  }
}
