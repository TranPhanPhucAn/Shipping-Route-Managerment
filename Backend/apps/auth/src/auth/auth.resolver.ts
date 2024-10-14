import { Resolver, Args, Context, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, LoginInputGoogle } from './dto/auth.dto';
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

@Resolver()
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
        const {
          user,
          accessToken,
          refreshToken,
          expAccessToken,
          permissionNames,
        } = result;
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
        return {
          user: user,
          expAccessToken: expAccessToken,
          permissionNames: permissionNames,
        };
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

  @Mutation(() => LoginResponse)
  async loginWithGoogle(
    @Args('loginInputGoogle') loginInputGoogle: LoginInputGoogle,
    @Context() context: any,
  ): Promise<LoginResponse> {
    try {
      const result = await this.authService.loginUserByGoogle(loginInputGoogle);
      if (result) {
        const {
          user,
          accessToken,
          refreshToken,
          expAccessToken,
          permissionNames,
        } = result;
        const expires = new Date(Date.now() + 20 * 60 * 60 * 1000);
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
        return {
          user: user,
          expAccessToken: expAccessToken,
          permissionNames: permissionNames,
        };
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
  async logout(@Context() context: any) {
    context.res.cookie('access_token', '', { expires: new Date(Date.now()) });
    context.res.cookie('refresh_token', '', { expires: new Date(Date.now()) });
    return await this.authService.logoutUser(context.req);
  }

  @Mutation(() => RefreshTokenResponse)
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any, @Context() context: any) {
    const result = await this.authService.refreshToken(request.user);
    const { accessToken, refreshToken, expAccessToken } = result;
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
    return {
      message: 'Refresh token successfull!',
      expAccessToken: expAccessToken,
    };
    // return await this.authService.refreshToken(request.user);
  }
}
