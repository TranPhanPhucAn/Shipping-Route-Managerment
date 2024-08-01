import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/auth.dto';
import { LoginResponse, RefreshTokenResponse } from '../types/auth.types';
import { AuthenticationError } from '@nestjs/apollo';
import { UserAuth } from './dto/auth.dto';
import { validate } from 'class-validator';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
// import { JWTGuard } from './guards/auth.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthUserGuard } from './guards/auth.guards';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    try {
      const userAuth = new UserAuth();
      userAuth.email = loginInput.email;
      userAuth.password = loginInput.password;
      validate(userAuth).then((errors) => {
        if (errors.length > 0) {
          console.log('Validation failed. errors: ', errors);
        } else {
          console.log('Validation succeed');
        }
      });
      const result = await this.authService.loginUserByPassword(loginInput);
      if (result) return result;
      throw new AuthenticationError('Could not login with provided data');
    } catch (err) {
      throw err;
    }
  }

  @Query(() => String, { name: 'logout' })
  @UseGuards(AuthUserGuard)
  async logout(@Context() context: { req: Request }) {
    // console.log('req: ', context.req);
    return await this.authService.logoutUser(context.req);
  }

  @Query(() => RefreshTokenResponse, { name: 'refreshToken' })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any) {
    // if (!user) {
    //   console.log('abc');
    //   throw new AuthenticationError(`Could not login with provided data`);
    // }
    // const result = this.authService.createAccessToken(user);
    // if (result) return result.token;
    return await this.authService.refreshToken(request.user);
  }
}
