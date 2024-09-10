import { Test, TestingModule } from '@nestjs/testing';
import { VesselsResolver } from './vessels.resolver';
import { VesselsService } from './vessels.service';

describe('VesselsResolver', () => {
  let resolver: VesselsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VesselsResolver, VesselsService],
    }).compile();

    resolver = module.get<VesselsResolver>(VesselsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
