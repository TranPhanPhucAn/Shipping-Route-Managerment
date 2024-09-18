import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient } from '../proto/user';
// import { UserServiceClient } from 'proto/user';
// import { UpdateRouteInput } from './dto/update-route.input';
import { Port } from '../ports/entities/port.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
  ) {}

  async create(createRouteInput: CreateRouteInput): Promise<Route> {
    const { departurePortId, destinationPortId, distance } = createRouteInput;

    const departurePort = await this.portRepository.findOne({
      where: { id: createRouteInput.departurePortId },
    });
    const destinationPort = await this.portRepository.findOne({
      where: { id: createRouteInput.destinationPortId },
    });

    if (!departurePort || !destinationPort) {
      throw new Error('Invalid port id(s)');
    }
    if (departurePortId === destinationPortId) {
      throw new BadRequestException(
        'Departure port and destination port cannot be the same',
      );
    }
    const route = this.routeRepository.create({
      departurePort,
      destinationPort,
      distance,
    });

    return this.routeRepository.save(route);
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find({
      relations: ['departurePort', 'destinationPort'],
    });
  }

  async findOne(id: string): Promise<Route> {
    const route = this.routeRepository.findOne({
      where: { id },
      relations: ['departurePort', 'destinationPort'],
    });
    if (!route) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }
    return route;
  }

  async update(id: string, updateRouteInput: UpdateRouteInput): Promise<Route> {
    const { departurePortId, destinationPortId, distance } = updateRouteInput;

    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    const departurePort = await this.portRepository.findOne({
      where: { id: departurePortId },
    });
    const destinationPort = await this.portRepository.findOne({
      where: { id: destinationPortId },
    });

    if (!departurePort || !destinationPort) {
      throw new BadRequestException('Invalid port id(s)');
    }

    if (departurePortId === destinationPortId) {
      throw new BadRequestException(
        'Departure port and destination port cannot be the same',
      );
    }

    route.departurePort = departurePort;
    route.destinationPort = destinationPort;
    route.distance = distance;

    return this.routeRepository.save(route);
  }

  async remove(id: string): Promise<string> {
    await this.routeRepository.delete(id);
    return id;
  }

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  getUser(id: string) {
    return this.userService.getUser({ id });
  }
}
