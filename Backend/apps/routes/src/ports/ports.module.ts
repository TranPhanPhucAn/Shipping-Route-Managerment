import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsResolver } from './ports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from './entities/port.entity';
import { Route } from '../routes/entities/route.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Port, Route]), HttpModule  ],
  providers: [PortsService, PortsResolver],
})
export class PortsModule {}
