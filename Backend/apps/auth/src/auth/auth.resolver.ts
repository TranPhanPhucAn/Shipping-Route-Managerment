import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/auth.dto';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from '../types/auth.types';
import { AuthenticationError } from '@nestjs/apollo';
import { UseGuards } from '@nestjs/common';
// import { JWTGuard } from './guards/auth.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthUserGuard } from './guards/auth.guards';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    try {
      const result = await this.authService.loginUserByPassword(loginInput);
      if (result) return result;
      throw new AuthenticationError('Could not login with provided data');
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(AuthUserGuard)
  async logout(@Context() context: { req: Request }) {
    return await this.authService.logoutUser(context.req);
  }

  @Query(() => RefreshTokenResponse, { name: 'refreshToken' })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any) {
    return await this.authService.refreshToken(request.user);
  }
}
