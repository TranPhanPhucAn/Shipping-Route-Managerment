import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedingService } from './seeding.service';
import { seedRouteResponse } from '../types/route.types';

@Resolver()
export class SeedingResolver {
  constructor(private readonly seedingService: SeedingService) {}

  @Mutation(() => seedRouteResponse)
  seedRoute() {
    return this.seedingService.seed();
  }
}
