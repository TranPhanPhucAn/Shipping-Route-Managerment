import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Route } from './routes/entities/route.entity';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from './routes/routes.module';
import { HealthModule } from './health/health.module';
import { User } from './routes/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: { orphanedTypes: [User] },
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPE_DB as 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // entities: [Route],
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    RouteModule,
    HealthModule,
  ],
  providers: [],
})
export class RoutesModule {}
