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
// import { CacheModule } from '@nestjs/cache-manager';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as redisStore from 'cache-manager-redis-store';
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
                request.http.headers.set('refreshtoken', context.refreshtoken);
                request.http.headers.set(
                  'expirationtime',
                  context.expirationtime,
                );
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
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<number>('REDIS_PORT'),
    //     username: configService.get<string>('REDIS_USER'),
    //     password: configService.get<string>('REDIS_PASSWORD'),
    //     ttl: 60,
    //   }),
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
