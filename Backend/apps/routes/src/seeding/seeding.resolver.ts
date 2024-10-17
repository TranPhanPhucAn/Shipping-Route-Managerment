import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedingService } from './seeding.service';
// import { seedRouteResponse } from '../types/route.types';

@Resolver()
export class SeedingResolver {
  constructor(private readonly seedingService: SeedingService) {}

  @Mutation(() => String)
  async seed(): Promise<string> {
    try {
      return await this.seedingService.seed();
    } catch (error) {
      throw new Error('Seeding failed');
    }
  }
}
