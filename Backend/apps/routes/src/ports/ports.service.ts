import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Port } from './entities/port.entity';
import { CreatePortInput } from './dto/create-port.input';
import { UpdatePortInput } from './dto/update-port.input';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Route } from '../routes/entities/route.entity';
import { PaginationPortDto } from './dto/pagination-port';

@Injectable()
export class PortsService {
  constructor(
    @InjectRepository(Port)
    private portRepository: Repository<Port>,
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    private readonly httpService: HttpService,
  ) {}

  async create(createPortInput: CreatePortInput): Promise<Port> {
    try {
      let latitude = null;
      let longitude = null;
      if (!latitude || !longitude) {
        const geoData = await this.fetchCoordinatesFromGeocodingAPI(
          createPortInput.name,
          createPortInput.country,
        );
        latitude = geoData.latitude;
        longitude = geoData.longitude;
      }
      const newPort = this.portRepository.create({
        ...createPortInput,
        latitude,
        longitude,
      });
      return await this.portRepository.save(newPort);
    } catch (error) {
      console.error('Error creating port:', error);
      throw new BadRequestException(error.message || 'Failed to create port');
    }
  }
  private async fetchCoordinatesFromGeocodingAPI(
    name: string,
    country: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${name},${country}`,
        ),
      );

      const location = response.data[0];

      if (!location) {
        throw new Error('No location found from geocoding API');
      }
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
      };
    } catch (error) {
      console.error('Error fetching coordinates from geocoding API:', error);
      throw new BadRequestException(
        'Failed to fetch coordinates from geocoding API',
      );
    }
  }
  async findAll(): Promise<Port[]> {
    return this.portRepository.find();
  }

  async findOne(id: string): Promise<Port> {
    const port = await this.portRepository.findOneBy({ id });
    if (!port) {
      throw new NotFoundException(`Port with Name "${id}" not found`);
    }
    return port;
  }

  async update(id: string, updatePortInput: UpdatePortInput): Promise<Port> {
    const port = await this.portRepository.findOne({
      where: { id}
    })

    if (!port) {
      throw new NotFoundException(`Port with Name "${id}" not found`);
    }
    port.country = updatePortInput.country;
    port.name = updatePortInput.name;
    if (!port.latitude || !port.longitude) {
      const geoData = await this.fetchCoordinatesFromGeocodingAPI(
        port.name,
        port.country,
      );
      port.latitude = geoData.latitude;
      port.longitude = geoData.longitude;
    }
    return this.portRepository.save(port);
  }

  async remove(id: string): Promise<string> {
    const port = this.portRepository.findOne({
      where: { id },
      relations: ['departureRoutes', 'destinationRoutes'],
    });
    if (!port) {
      throw new NotFoundException(`The port with ID ${id} is not found.`);
    }
    await this.portRepository.delete(id);
    return id;
  }

  async paginationPort(paginationPort: PaginationPortDto) {
    const { limit, offset, sort, search } = paginationPort;

    const skips = limit * offset;
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
      skip: skips,
      order,
    };

    const whereCondition: any = {};
    if (search) {
      whereCondition.country = ILike(`%${search}%`);
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }

    const [result, total] =
      await this.portRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      ports: result,
      totalCount: totalCount,
    };
  }
}
