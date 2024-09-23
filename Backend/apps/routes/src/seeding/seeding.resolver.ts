import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedingService } from './seeding.service';
import { SeedResponse } from '../types/route.types';

@Resolver()
export class SeedingResolver {
  constructor(private readonly seedingService: SeedingService) {}

  @Mutation(() => SeedResponse)
  seed() {
    return this.seedingService.seed();
  }
}
