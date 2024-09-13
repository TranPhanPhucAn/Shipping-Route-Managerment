import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { SeedingResolver } from './seeding.resolver';

@Module({
  providers: [SeedingResolver, SeedingService],
})
export class SeedingModule {}
