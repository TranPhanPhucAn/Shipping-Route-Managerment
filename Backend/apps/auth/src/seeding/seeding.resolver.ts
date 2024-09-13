import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedingService } from './seeding.service';
import { LogoutResponse } from '../types/auth.types';

@Resolver()
export class SeedingResolver {
  constructor(private readonly seedingService: SeedingService) {}

  @Mutation(() => LogoutResponse)
  seed() {
    return this.seedingService.seed();
  }
}
