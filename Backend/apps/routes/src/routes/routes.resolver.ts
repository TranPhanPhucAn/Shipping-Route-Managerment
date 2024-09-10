import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(private readonly routeService: RoutesService) {}

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
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Route> {
    return this.routeService.findOne(id);
  }

  @Mutation(() => Route)
  async updateRoute(
    @Args('updateRouteInput') updateRouteInput: UpdateRouteInput,
  ): Promise<Route> {
    return this.routeService.update(updateRouteInput.id, updateRouteInput);
  }

  @Mutation(() => Route)
  async removeROute(@Args('id', { type: () => Number }) id: number) {
    return this.routeService.delete(id);
  }
}
