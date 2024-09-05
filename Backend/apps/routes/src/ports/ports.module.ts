import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsResolver } from './ports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from './entities/port.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Port])],
  providers: [PortsService, PortsResolver],
})
export class PortsModule {}
