import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { handleAuth } from './auth.context';
import { AuthService } from './auth/auth.service';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (authService: AuthService) => ({
        server: {
          context: ({ req }) => handleAuth({ req }, authService),
        },
        // driver: ApolloGatewayDriver,
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
      inject: [AuthService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
