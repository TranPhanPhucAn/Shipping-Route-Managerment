import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [RoutesModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
