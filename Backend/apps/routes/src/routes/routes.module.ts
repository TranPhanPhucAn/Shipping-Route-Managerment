import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesResolver } from './routes.resolver';

@Module({
  providers: [RoutesResolver, RoutesService],
})
export class RoutesModule {}
