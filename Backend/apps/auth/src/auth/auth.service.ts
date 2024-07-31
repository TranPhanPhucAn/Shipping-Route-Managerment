import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/auth.dto';
import { LoginResponse } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthenticationError } from 'apollo-server-express';
import * as bycypt from 'bcrypt';
import { JWTPayload } from './interfaces/jwtPayLoad.interface';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  loginUserByPassword = async (
    loginInput: LoginInput,
  ): Promise<LoginResponse | undefined> => {
    let user: User | undefined;
    if (loginInput.email) {
      user = await this.userService.findOneByEmail(loginInput.email);
      if (!user) {
        throw new AuthenticationError(`Email is not exist`);
      }
    }
    let isMatch: boolean = false;
    try {
      isMatch = await this.comparePassword(loginInput.password, user.password);
    } catch (err) {
      console.log(err);
    }
    if (isMatch) {
      const token = this.createToken(user).token;
      const refreshToken = this.createRefreshToken(user).token;
      return {
        user,
        accessToken: token,
        refreshToken: refreshToken,
      };
    }
    return null;
  };
  createToken(user: User): { data: JWTPayload; token: string } {
    // const expiresIn = process.env.EXPIRES_IN;
    // let expiration: Date | undefined;
    // if (expiresIn) {
    //   expiration = new Date();
    //   expiration.setTime(expiration.getTime() + (+expiresIn) * 1000);
    // }
    const data: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      // permission: user.permission,
      // expiration
    };
    const jwt = this.jwtService.sign(data);
    return {
      data,
      token: jwt,
    };
  }
  createRefreshToken(user: User): { data: JWTPayload; token: string } {
    const data: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    const jwt = this.jwtService.sign(data, { expiresIn: '1d' });
    return {
      data,
      token: jwt,
    };
  }
  private async comparePassword(enteredPassword, dbPassword) {
    return await bycypt.compare(enteredPassword, dbPassword);
  }

  async validateJWTPayLoad(payload: JWTPayload): Promise<User | undefined> {
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      // user.updated_at = new Date();
      return user;
    }
    return undefined;
  }
}
