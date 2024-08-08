import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
// import { join } from 'path';
import { AuthenModule } from './auth/authen.module';
import { EmailModule } from './email/email.module';
import { UserGrpcServiceController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
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
  ],
  providers: [],
  controllers: [UserGrpcServiceController],
})
export class AuthModule {}
