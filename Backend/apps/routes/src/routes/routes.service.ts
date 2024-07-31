import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteInput } from './dto/create-route.input';
// import { UpdateRouteInput } from './dto/update-route.input';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}

  create = async (createRouteInput: CreateRouteInput): Promise<Route> => {
    const routeEntity = this.routesRepository.create();
    const newRoute = {
      ...routeEntity,
      ...createRouteInput,
    };
    const route: Route | undefined = await this.routesRepository.save(newRoute);
    return route;
  };
  findAll() {
    return `This action returns all routes`;
  }

  async findOne(id: string): Promise<Route> {
    return await this.routesRepository.findOne({ where: { id: id } });
  }

  // update(id: number, updateRouteInput: UpdateRouteInput) {
  //   return `This action updates a #${id} route`;
  // }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
