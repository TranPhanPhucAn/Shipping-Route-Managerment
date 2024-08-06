import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesResolver } from './routes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { UsersResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [RoutesResolver, RoutesService, UsersResolver],
})
export class RouteModule {}
