import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { UsersService } from '../../users/users.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { permission } from 'process';

@Injectable()
export class PermissionsGuard implements CanActivate {
  //   constructor(private usersService: UsersService) {}
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    //   console.log('req header: ', req.headers);
    const userPermissions = req.headers.permissions.split(',');
    const requiredPermissions =
      this.reflector.get('permissions', context.getHandler()) || [];
    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
    if (requiredPermissions.length === 0 || hasAllRequiredPermissions) {
      return true;
    }
    throw new GraphQLError('Insufficient permissions', {
      extensions: {
        errorCode: '5001-10',
      },
    });
  }
}
