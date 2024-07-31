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
  const decoded = verify(authToken, process.env.ACCESS_SECRET);
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
    if (req.headers.authorization) {
      const token = getToken(req.headers.authorization);
      const decoded = decodedToken(token);
      console.log(`userId:${req.headers.authorization}`);
      return {
        userId: decoded.userId,
        authorization: `${req.headers.authorization}`,
      };
    }
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid authorization headers',
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
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('userId', context.userId);
              request.http.headers.set('authorization', context.authorization);
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
