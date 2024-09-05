import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesResolver } from './schedules.resolver';
import { Schedule } from './entities/schedule.entity';
import { Vessel } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Vessel, Route])],
  providers: [SchedulesService, SchedulesResolver],
  exports: [SchedulesService],
})
export class SchedulesModule {}
