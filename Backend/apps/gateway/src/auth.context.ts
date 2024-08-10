import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { AuthService } from './auth/auth.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const getToken = (authToken: string): string => {
  const match = authToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new HttpException(
      {
        message: 'Invalid Authorization token - Token does not match Bearer .*',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return match[1];
};

const decodedToken = (authToken: string) => {
  const decoded = verify(authToken, process.env.ACCESS_SECRET, {
    ignoreExpiration: true,
  });
  const expirationTime = decoded?.exp;
  if (expirationTime * 1000 < Date.now()) {
    throw new HttpException(
      { message: 'Access token expired' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  if (!decoded) {
    throw new HttpException(
      { message: 'Invalid Auth Token' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return decoded;
};

export const handleAuth = async ({ req }, authService: AuthService) => {
  //   const app = await NestFactory.createApplicationContext(AppModule);
  //   const authService = app.get(AuthService);

  try {
    let isLogin: string = '';
    let userId: string = '';
    let email: string = '';
    const refreshToken: string = req.headers.refreshtoken;
    if (req.headers.accesstoken) {
      const token = getToken(req.headers.accesstoken);
      const decoded = decodedToken(token);
      userId = decoded.userId;
      email = decoded.email;
      isLogin = 'true';
      console.log('abc');
      console.log(await authService.getUser(userId));
    }
    // await app.close();
    return {
      userid: userId,
      email: email,
      islogin: isLogin,
      refreshtoken: refreshToken,
    };
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid accessToken headers',
    );
  }
};
