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
import { Code } from 'typeorm';
dotenv.config();
// import { CacheModule } from '@nestjs/cache-manager';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as redisStore from 'cache-manager-redis-store';
interface OriginalError {
  message: string[];
}
@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (authService: AuthService) => ({
        server: {
          context: ({ req }) => handleAuth({ req }, authService),
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code,
              errCode: error.extensions?.errorCode,
            };
          },
        },
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
              didReceiveResponse({ response, request, context }) {
                if (response.errors) {
                  response.errors = response.errors.map((error) => {
                    return {
                      message: error.message,
                      extensions: {
                        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                        errorCode: error.extensions?.errCode || 'UNKNOWN_ERROR',
                        serviceName: error.extensions?.serviceName,
                      },
                    };
                  });
                  return {
                    errors: response.errors,
                    data: null, // Ensure data is null when there's an error
                  };
                }
                return response;
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
        formatError: (error) => {
          console.log('absd\n\n\n');
          const originalError = error.extensions
            ?.originalError as OriginalError;
          if (!originalError) {
            return {
              message: error.message,
              code: error.extensions?.code,
              errCode: error.extensions?.errorCode,
            };
          }

          return {
            message: originalError.message[0],
            code: error.extensions?.code,
            errCode: error.extensions?.errorCode,
          };
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
