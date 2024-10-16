import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PortsService } from './ports.service';
import { Port } from './entities/port.entity';
import { CreatePortInput } from './dto/create-port.input';
import { UpdatePortInput } from './dto/update-port.input';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissions.guard';

@Resolver(() => Port)
export class PortsResolver {
  constructor(private readonly portService: PortsService) {}

  @SetMetadata('permissions', ['create:port'])
  @UseGuards(PermissionsGuard)
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
  async findOne(@Args('ID', { type: () => String }) id: string): Promise<Port> {
    return this.portService.findOne(id);
  }

  @SetMetadata('permissions', ['update:port'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Port)
  async updatePort(
    @Args('ID', { type: () => String }) id: string,
    @Args('updatePortInput') updatePortInput: UpdatePortInput,
  ): Promise<Port> {
    return this.portService.update(id, updatePortInput);
  }

  @SetMetadata('permissions', ['delete:port'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Port)
  async removePort(
    @Args('ID', { type: () => String }) id: string,
  ):Promise<string> {
    return this.portService.remove(id);
  }
}
