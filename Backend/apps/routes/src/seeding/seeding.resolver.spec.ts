import { Test, TestingModule } from '@nestjs/testing';
import { SeedingResolver } from './seeding.resolver';
import { SeedingService } from './seeding.service';

describe('SeedingResolver', () => {
  let resolver: SeedingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedingResolver, SeedingService],
    }).compile();

    resolver = module.get<SeedingResolver>(SeedingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
