import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VesselsService } from './vessels.service';
import { VesselsResolver } from './vessels.resolver';
import { Vessel } from './entities/vessel.entity';
import { User } from '../routes/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vessel, User])],
  providers: [VesselsService, VesselsResolver],
  exports: [VesselsService],
})
export class VesselsModule {}
