import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PortsService } from './ports.service';
import { Port } from './entities/port.entity';
import { CreatePortInput } from './dto/create-port.input';
import { UpdatePortInput } from './dto/update-port.input';

@Resolver(() => Port)
export class PortsResolver {
  constructor(private readonly portService: PortsService) {}

  @Mutation(() => Port)
  async createPort(
    @Args('createPortInput') createPortInput: CreatePortInput,
  ): Promise<Port> {
    return this.portService.create(createPortInput);
  }

  @Query(() => [Port], { name: 'ports' })
  async findAll(): Promise<Port[]> {
    return this.portService.findAll();
  }

  @Query(() => Port, { name: 'port' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Port> {
    return this.portService.findOne(id);
  }

  @Mutation(() => Port)
  async updatePort(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePortInput') updatePortInput: UpdatePortInput,
  ): Promise<Port> {
    return this.portService.update(id, updatePortInput);
  }

  @Mutation(() => Port)
  async removePort(@Args('id', { type: () => ID }) id: string): Promise<Port> {
    return this.portService.remove(id);
  }
}
