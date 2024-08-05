import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
// import { UpdateRouteInput } from './dto/update-route.input';

@Resolver((of) => Route)
export class RoutesResolver {
  constructor(private readonly routesService: RoutesService) {}

  @Mutation(() => Route)
  createRoute(@Args('createRouteInput') createRouteInput: CreateRouteInput) {
    return this.routesService.create(createRouteInput);
  }
  @Query(() => [Route], { name: 'routes' })
  findAll() {
    return this.routesService.findAll();
  }

  @Query(() => Route, { name: 'route' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.routesService.findOne(id);
  }

  @Mutation(() => Route)
  // updateRoute(@Args('updateRouteInput') updateRouteInput: UpdateRouteInput) {
  //   return this.routesService.update(updateRouteInput.id, updateRouteInput);
  // }
  @Mutation(() => Route)
  removeRoute(@Args('id', { type: () => Int }) id: number) {
    return this.routesService.remove(id);
  }

  // @ResolveReference()
  // resolveReferUser(ref: { __typename: string; id: string }) {
  //   return this.routesService.findOne(ref.id);
  // }

  @ResolveField()
  user(@Parent() route: Route) {
    return { __typename: 'User', id: route.userId };
  }
}
