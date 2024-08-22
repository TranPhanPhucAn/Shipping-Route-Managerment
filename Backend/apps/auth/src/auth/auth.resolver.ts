import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/auth.dto';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from '../types/auth.types';
import { UseGuards } from '@nestjs/common';
// import { JWTGuard } from './guards/auth.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { GraphQLError } from 'graphql';
// import { AuthUserGuard } from './guards/auth.guards';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: any,
  ): Promise<LoginResponse> {
    try {
      const result = await this.authService.loginUserByPassword(loginInput);
      if (result) {
        const { accessToken, refreshToken } = result;
        const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
        context.res.cookie('access_token', 'Bearer ' + accessToken, {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
          expires,
        });
        context.res.cookie('refresh_token', 'Bearer ' + refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
          expires,
        });
        return result;
      }
      throw new GraphQLError('Could not login with provided data', {
        extensions: {
          errorCode: '5001-2',
        },
      });
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => LogoutResponse)
  // @UseGuards(AuthUserGuard)
  async logout(@Context() context: { req: Request }) {
    return await this.authService.logoutUser(context.req.headers);
  }

  @Query(() => RefreshTokenResponse, { name: 'refreshToken' })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any) {
    return await this.authService.refreshToken(request.user);
  }
}
