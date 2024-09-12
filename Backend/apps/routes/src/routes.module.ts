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
import { dataSourceOptions } from './db-migration/data-source';
// import { dataSourceOptions } from 'db-migration/data-source';
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
    TypeOrmModule.forRoot(dataSourceOptions),
    RouteModule,
    HealthModule,
  ],
  providers: [],
})
export class RoutesModule {}
