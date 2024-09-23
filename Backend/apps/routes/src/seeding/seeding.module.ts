import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from '../ports/entities/port.entity';
import { Vessel } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { SeedingService } from './seeding.service';
import { SeedingResolver } from './seeding.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Port, Vessel, Route, Schedule])],
  providers: [SeedingService, SeedingResolver],
})
export class SeedingModule {}
