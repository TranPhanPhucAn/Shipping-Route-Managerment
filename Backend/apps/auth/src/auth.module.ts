import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
// import { join } from 'path';
import { AuthenModule } from './auth/authen.module';
import { UserGrpcServiceController } from './users/users.controller';
import { CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-store';
import * as redisStore from 'cache-manager-redis-store';
// import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SeedingModule } from './seeding/seeding.module';
import { dataSourceOptions } from './db-migration/data-source';
import { FilesModule } from './files/files.module';

interface OriginalError {
  message: string[];
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: async () => {
        return {
          autoSchemaFile: {
            federation: 2,
          },
          context: ({ req, res }) => ({ req, res }),
          playground: {
            settings: {
              'request.credentials': 'include', // Otherwise cookies won't be sent
            },
          },
          formatError: (error) => {
            const originalError = error.extensions
              ?.originalError as OriginalError;
            if (!originalError) {
              return {
                message: error.message,
                extensions: {
                  code: error.extensions?.code,
                  errorCode: error.extensions?.errorCode,
                },
              };
            }
            return {
              message: originalError.message[0],
              extensions: {
                code: error.extensions?.code,
                errorCode: error.extensions?.errorCode,
              },
            };
          },
        };
      },
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    HealthModule,
    AuthenModule,
    SeedingModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USER'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 60,
      }),
    }),
    RolesModule,
    PermissionsModule,
    SeedingModule,
    FilesModule,
  ],
  providers: [],
  controllers: [UserGrpcServiceController],
})
export class AuthModule {}
