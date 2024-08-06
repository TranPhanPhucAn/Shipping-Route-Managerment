import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UserServiceClient } from './users.services';
import { firstValueFrom, Observable } from 'rxjs';
import { RouteUserResponse } from '../types/route.types';
// import { UpdateRouteInput } from './dto/update-route.input';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(
    private readonly routesService: RoutesService,
    private readonly userServiceClient: UserServiceClient,
  ) {}

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

  @ResolveReference()
  resolveReferUser(ref: { __typename: string; id: string }) {
    return this.routesService.findOne(ref.id);
  }

  @Query(() => RouteUserResponse, { name: 'routeUser' })
  async routeUser(@Args('userId') userId: string) {
    console.log('123456');
    const userObservable = this.userServiceClient.getUser(userId);
    const user = await firstValueFrom(userObservable);
    console.log('abc: ', user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
