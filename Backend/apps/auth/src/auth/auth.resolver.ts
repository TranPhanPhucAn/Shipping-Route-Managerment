import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginInput } from './dto/auth.dto';
import { LoginResponse } from '../types/auth.types';
import { AuthenticationError } from '@nestjs/apollo';
import { UserAuth } from './dto/auth.dto';
import { validate } from 'class-validator';

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
      console.log('check here: ', userAuth);
      const result = await this.authService.loginUserByPassword(loginInput);
      if (result) return result;
      throw new AuthenticationError('Could not login with provided data');
    } catch (err) {
      throw err;
    }
  }
}
