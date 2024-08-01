import {
  HttpException,
  HttpStatus,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
dotenv.config();

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

const handleAuth = ({ req }) => {
  try {
    let isLogin: string = '';
    let userId: string = '';
    let email: string = '';
    let accessToken: string = '';
    const refreshToken: string = req.headers.refreshtoken;
    if (req.headers.accesstoken) {
      const token = getToken(req.headers.accesstoken);
      const decoded = decodedToken(token);
      userId = decoded.userId;
      email = decoded.email;
      isLogin = 'true';
      accessToken = req.headers.accesstoken;
    }
    return {
      userid: userId,
      email: email,
      islogin: isLogin,
      accesstoken: accessToken,
      refreshtoken: refreshToken,
    };
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid accessToken headers',
    );
  }
};
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      server: {
        context: handleAuth,
      },
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('userid', context.userid);
              request.http.headers.set('accesstoken', context.accesstoken);
              request.http.headers.set('islogin', context.islogin);
              request.http.headers.set('refreshtoken', context.refreshtoken);
            },
          });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'auth',
              url: `http://localhost:${process.env.AUTH_PORT}/graphql`,
            },
            {
              name: 'routes',
              url: `http://localhost:${process.env.ROUTES_PORT}/graphql`,
            },
          ],
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
