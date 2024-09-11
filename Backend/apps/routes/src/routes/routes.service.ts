import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteInput } from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { Port } from '../ports/entities/port.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
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
    await this.routeRepository.update(id, updateRouteInput);
    return await this.routeRepository.findOne({ where: { id: id } });
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.routeRepository.delete(id);
    return result.affected > 0;
  }
}
