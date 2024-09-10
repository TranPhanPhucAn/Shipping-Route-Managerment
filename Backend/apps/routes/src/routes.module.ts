import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './routes/entities/route.entity';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from './routes/routes.module';
import { HealthModule } from './health/health.module';
import { User } from './routes/entities/user.entity';
import { Port } from './ports/entities/port.entity';
import { Vessel } from './vessels/entities/vessel.entity';
import { Schedule } from './schedules/entities/schedule.entity';
import { DataSource } from 'typeorm';
import { PortsModule } from './ports/ports.module';
import { VesselsModule } from './vessels/vessels.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: { orphanedTypes: [User, Port, Vessel, Schedule] },
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPE_DB as 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Route, User, Port, Vessel, Schedule],
      autoLoadEntities: true,
      synchronize: true,
    }),
    RouteModule,
    HealthModule,
    PortsModule,
    VesselsModule,
  ],
  providers: [],
})
export class RoutesModule {
  constructor(private datasource: DataSource) {}
}
