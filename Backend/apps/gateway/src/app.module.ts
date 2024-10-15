import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { handleAuth } from './auth.context';
import { AuthService } from './auth/auth.service';
import { GraphQLDataSource } from './graphql-datasource';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
dotenv.config();
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
          playground: {
            settings: {
              'request.credentials': 'include', // Otherwise cookies won't be sent
            },
          },
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code,
              errCode: error.extensions?.errorCode,
            };
          },
        },
        gateway: {
          // buildService: ({ url }) => {
          //   return new RemoteGraphQLDataSource({
          //     url,
          //     willSendRequest({ request, context }: any) {
          //       request.http.headers.set('userid', context.userid);
          //       request.http.headers.set('accesstoken', context.accesstoken);
          //       request.http.headers.set('refreshtoken', context.refreshtoken);
          //       request.http.headers.set(
          //         'expirationtime',
          //         context.expirationtime,
          //       );
          //     },
          //     // didReceiveResponse({ response, request, context }) {
          //     //   if (response.errors) {
          //     //     response.errors = response.errors.map((error) => {
          //     //       return {
          //     //         message: error.message,
          //     //         extensions: {
          //     //           code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          //     //           errorCode: error.extensions?.errCode || 'UNKNOWN_ERROR',
          //     //           serviceName: error.extensions?.serviceName,
          //     //         },
          //     //       };
          //     //     });
          //     //     return {
          //     //       errors: response.errors,
          //     //       data: null, // Ensure data is null when there's an error
          //     //     };
          //     //   }
          //     //   return response;
          //     // },
          //   });
          // },
          buildService: ({ url }) => new GraphQLDataSource({ url }),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    { provide: 'Upload', useValue: GraphQLUpload },
  ],
})
export class AppModule {}
