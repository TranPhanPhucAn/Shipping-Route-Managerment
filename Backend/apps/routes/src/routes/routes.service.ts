import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  async create(createRouteInput: CreateRouteInput): Promise<Route> {
    const newRoute = this.routeRepository.create(createRouteInput);
    return this.routeRepository.save(newRoute);
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOneBy({ id });
    if (!route) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }
    return route;
  }

  async update(id: string, updateRouteInput: UpdateRouteInput): Promise<Route> {
    const route = await this.routeRepository.preload({
      id: id,
      ...updateRouteInput,
    });

    if (!route) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }

    return this.routeRepository.save(route);
  }

  async remove(id: string): Promise<Route> {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
    return route;
  }
}
