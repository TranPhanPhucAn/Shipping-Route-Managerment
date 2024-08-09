import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { handleAuth } from './auth.context';
dotenv.config();

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
