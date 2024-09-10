import { Test, TestingModule } from '@nestjs/testing';
import { PortsResolver } from './ports.resolver';
import { PortsService } from './ports.service';

describe('PortsResolver', () => {
  let resolver: PortsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortsResolver, PortsService],
    }).compile();

    resolver = module.get<PortsResolver>(PortsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
