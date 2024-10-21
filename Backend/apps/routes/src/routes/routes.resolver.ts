import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';
import { Port } from '../ports/entities/port.entity';
import {
  CreateRouteInput,
  PaginationRoutesDto,
} from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissions.guard';
import { PaginationRouteResponse } from '../types/route.types';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(
    private readonly routeService: RoutesService,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
  ) {}

  @SetMetadata('permissions', ['create:route'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Route)
  async createRoute(
    @Args('createRouteInput') createRouteInput: CreateRouteInput,
  ): Promise<Route> {
    return this.routeService.createWithCalculatedDistance(createRouteInput);
  }

  @Query(() => [Route], { name: 'routes' })
  async findAll(): Promise<Route[]> {
    return this.routeService.findAll();
  }
  @Query(() => Route, { name: 'route' })
  async findOne(@Args('id') id: string): Promise<Route> {
    return this.routeService.findOne(id);
  }

  @SetMetadata('permissions', ['update:route'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Route)
  async updateRoute(
    @Args('id') id: string,
    @Args('updateRouteInput') updateRouteInput: UpdateRouteInput,
  ): Promise<Route> {
    return this.routeService.update(id, updateRouteInput);
  }

  @SetMetadata('permissions', ['delete:route'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => String)
  async removeRoute(@Args('id') id: string): Promise<string> {
    return this.routeService.remove(id);
  }

  @SetMetadata('permissions', ['get:routesPag'])
  @UseGuards(PermissionsGuard)
  @Query(() => PaginationRouteResponse, { name: 'paginationRoute' })
  paginationRoute(
    @Args('paginationRoute') paginationRoute: PaginationRoutesDto,
  ) {
    return this.routeService.paginationRoute(paginationRoute);
  }
}
