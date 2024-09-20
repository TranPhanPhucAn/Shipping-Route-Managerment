import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { Port } from '../ports/entities/port.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(
    private readonly routeService: RoutesService,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
  ) {}

  @Mutation(() => Route)
  async createRoute(
    @Args('createRouteInput') createRouteInput: CreateRouteInput,
  ): Promise<Route> {
    return this.routeService.create(createRouteInput);
  }

  @Query(() => [Route], { name: 'routes' })
  async findAll(): Promise<Route[]> {
    return this.routeService.findAll();
  }
  @Query(() => Route, { name: 'route' })
  async findOne(@Args('id') id: string): Promise<Route> {
    return this.routeService.findOne(id);
  }

  @Mutation(() => Route)
  async updateRoute(
    @Args('id') id: string,
    @Args('updateRouteInput') updateRouteInput: UpdateRouteInput,
  ): Promise<Route> {
    return this.routeService.update(id, updateRouteInput);
  }

  @Mutation(() => String)
  async removeRoute(@Args('id') id: string): Promise<string> {
    return this.routeService.remove(id);
  }
}
