import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from './routes/routes.module';
import { HealthModule } from './health/health.module';
import { User } from './routes/entities/user.entity';
import { DataSource } from 'typeorm';
import { PortsModule } from './ports/ports.module';
import { VesselsModule } from './vessels/vessels.module';
import { SchedulesModule } from './schedules/schedules.module';
import { dataSourceOptions } from './db-migration/data-source';
// import { dataSourceOptions } from 'db-migration/data-source';
import { SeedingModule } from './seeding/seeding.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    PortsModule,
    VesselsModule,
    SchedulesModule,
    SeedingModule,
  ],
  providers: [],
})
export class RoutesModule {
  constructor(private datasource: DataSource) {}
}
