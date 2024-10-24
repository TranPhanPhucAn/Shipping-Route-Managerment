import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import {
  CreateRouteInput,
  PaginationRoutesDto,
} from './dto/create-route.input';
import { UpdateRouteInput } from './dto/update-route.input';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient } from '../proto/user';
// import { UserServiceClient } from 'proto/user';
// import { UpdateRouteInput } from './dto/update-route.input';
import { Port } from '../ports/entities/port.entity';
@Injectable()
export class RoutesService {
  private readonly EARTH_RADIUS_KM = 6371;
  private readonly VESSEL_SPEED = 40;
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
  ) {}

  async createWithCalculatedDistance(
    createRouteInput: CreateRouteInput,
  ): Promise<Route> {
    const { departurePortId, destinationPortId } = createRouteInput;

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
    try {
      const distance = this.calculateMaritimeDistance(
        departurePort.latitude,
        departurePort.longitude,
        destinationPort.latitude,
        destinationPort.longitude,
      );

      if (distance === null || distance <= 0) {
        throw new BadRequestException(
          'Unable to calculate distance between ports',
        );
      }
      const estimatedTimeInHours = this.calculateEstimatedTime(
        distance,
        this.VESSEL_SPEED,
      );
      const { days } = this.convertTimeToDaysAndHours(estimatedTimeInHours);

      const route = this.routeRepository.create({
        departurePort,
        destinationPort,
        distance,
        estimatedTimeDays: days,
      });

      return await this.routeRepository.save(route);
    } catch (error) {
      console.error('Error creating route:', error);
      throw new BadRequestException('Failed to create route');
    }
  }

  private calculateMaritimeDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    try {
      // Convert coordinates to radians
      const toRad = (x: number): number => (x * Math.PI) / 180;
      lat1 = toRad(lat1);
      lon1 = toRad(lon1);
      lat2 = toRad(lat2);
      lon2 = toRad(lon2);

      // Haversine formula with maritime route adjustments
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Calculate basic distance
      let distance = this.EARTH_RADIUS_KM * c;

      // Apply maritime route adjustments
      const lonDiff = Math.abs(lon2 - lon1);
      const latDiff = Math.abs(lat2 - lat1);

      if (lonDiff > Math.PI / 6) {
        distance *= 1.2;
      } else if (lonDiff > Math.PI / 12) {
        distance *= 1.1;
      }
      if (latDiff > Math.PI / 6) {
        distance *= 1.1;
      }
      return parseFloat(distance.toFixed(2));
    } catch (error) {
      console.error('Error in maritime distance calculation:', error);
      throw new Error('Failed to calculate maritime distance');
    }
  }
  //calculate Estimated Time
  private calculateEstimatedTime(distance: number, speed: number): number {
    return distance / speed;
  }
  //cover estimated time
  private convertTimeToDaysAndHours(estimatedTimeInHours: number): {
    days: number;
  } {
    let days = Math.floor(estimatedTimeInHours / 24);
    const hours = Math.round(estimatedTimeInHours % 24);
    if (hours > 1) {
      days += 1;
    }

    return { days };
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
    const { departurePortId, destinationPortId } = updateRouteInput;

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
    route.distance = this.calculateMaritimeDistance(
      departurePort.latitude,
      departurePort.longitude,
      destinationPort.latitude,
      destinationPort.longitude,
    );
    const estimatedTimeInHours = this.calculateEstimatedTime(
      route.distance,
      this.VESSEL_SPEED,
    );
    const { days } = this.convertTimeToDaysAndHours(estimatedTimeInHours);
    route.estimatedTimeDays = days;

    return this.routeRepository.save(route);
  }

  async remove(id: string): Promise<string> {
    const route = this.routeRepository.findOne({where: {id}, relations:['departurePort', 'destinationPort']})
    if(!route) {
      throw new NotFoundException(`The route with ID ${id} is not found.`);
    }
    await this.routeRepository.delete(id);
    return id;
  }

  async paginationRoute(paginationRoute: PaginationRoutesDto) {
    const { limit, offset, sort, searchDep, searchDes } = paginationRoute;
    const skip = limit * offset;
    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      sort.split(',').forEach((sortParam: string) => {
        const [field, direction] = sortParam.split(' ');
        order[field] = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      });
    }
    order['id'] = 'DESC';

    const queryOptions: any = {
      take: limit,
      skip: skip,
      relations: ['departurePort', 'destinationPort'],
      order,
    };

    const whereCondition: any = {};
    if (searchDep) {
      whereCondition.departurePort = {
        name: ILike(`%${searchDep}%`),
      };
    }
    if (searchDes) {
      whereCondition.destinationPort = {
        name: ILike(`%${searchDes}%`),
      };
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }
    const [result, total] =
      await this.routeRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      routes: result,
      totalCount: totalCount,
    };
  }

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  getUser(id: string) {
    return this.userService.getUser({ id });
  }
}
