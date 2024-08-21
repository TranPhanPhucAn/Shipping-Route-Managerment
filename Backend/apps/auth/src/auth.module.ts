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
import { EmailModule } from './email/email.module';
import { UserGrpcServiceController } from './users/users.controller';
import { CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-store';
import * as redisStore from 'cache-manager-redis-store';
// import { GraphQLError, GraphQLFormattedError } from 'graphql';

interface OriginalError {
  message: string[];
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: (config: ConfigService) => {
        return {
          autoSchemaFile: {
            federation: 2,
          },
          formatError: (error) => {
            const originalError = error.extensions
              ?.originalError as OriginalError;
            if (!originalError) {
              return {
                message: error.message,
                extensions: {
                  code: error.extensions?.code,
                  errCode: error.extensions?.errorCode,
                },
              };
            }
            return {
              message: originalError.message[0],
              extensions: {
                code: error.extensions?.code,
                errCode: error.extensions?.errorCode,
              },
            };
          },
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPE_DB as 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // entities: [User],
      // entities: [join(__dirname, '/**/**.entity{.ts,.js}')],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    HealthModule,
    AuthenModule,
    EmailModule,
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
  ],
  providers: [],
  controllers: [UserGrpcServiceController],
})
export class AuthModule {}
