import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteInput } from './dto/create-route.input';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient } from '../proto/user';
// import { UserServiceClient } from 'proto/user';
// import { UpdateRouteInput } from './dto/update-route.input';

@Injectable()
export class RoutesService implements OnModuleInit {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
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
  async findAll(): Promise<Route[]> {
    return await this.routesRepository.find();
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

  async forUser(id: string) {
    return await this.routesRepository.find({ where: { userId: id } });
  }

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  getUser(id: string) {
    return this.userService.getUser({ id });
  }
}
