import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsResolver } from './ports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from './entities/port.entity';
import { Route } from '../routes/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Port, Route])],
  providers: [PortsService, PortsResolver],
})
export class PortsModule {}
