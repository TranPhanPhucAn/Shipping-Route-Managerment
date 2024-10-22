import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, ILike, In } from 'typeorm';
import { Schedule, ScheduleStatus } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { Vessel, VesselStatus } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';
import {
  PaginationScheduleByIdDto,
  PaginationScheduleDto,
} from './dto/pagination-schedules';

@Injectable()
export class SchedulesService {
  convertDateString(dateString: string): string {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @InjectRepository(Vessel)
    private vesselsRepository: Repository<Vessel>,
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}
  calculateArrivalTime(departureTime: Date, travelDays: number): Date {
    const arrivalTime = new Date(departureTime);
    arrivalTime.setDate(arrivalTime.getDate() + travelDays);
    return arrivalTime;
  }
  async create(createScheduleInput: CreateScheduleInput): Promise<Schedule> {
    const { departure_time, status } = createScheduleInput;
    const vessel = await this.vesselsRepository.findOne({
      where: { id: createScheduleInput.vesselId },
    });
    const route = await this.routesRepository.findOne({
      where: { id: createScheduleInput.routeId },
    });

    if (!route) {
      throw new NotFoundException(
        `Route with ID ${createScheduleInput.routeId} not found`,
      );
    }
    if (!vessel || vessel.status !== VesselStatus.AVAILABLE) {
      throw new NotFoundException(
        `This vessel not available. Current status: ${vessel.status}`,
      );
    }
    const Travel_Time = route.estimatedTimeDays;
    const departureTime = new Date(createScheduleInput.departure_time);
    if (isNaN(departureTime.getTime())) {
      throw new BadRequestException('Invalid departure time');
    }
    if (departureTime < new Date()) {
      throw new BadRequestException('Departure time must be in the future');
    }

    const arrival_time = this.calculateArrivalTime(departureTime, Travel_Time);
    const schedule = this.schedulesRepository.create({
      vessel,
      route,
      status,
      departure_time: departure_time.toISOString(),
      arrival_time: arrival_time.toISOString(),
    });
    const saveschedule = await this.schedulesRepository.save(schedule);
    vessel.status = VesselStatus.IN_TRANSIT;
    await this.vesselsRepository.save(vessel);
    return saveschedule;
  }

  findAll(): Promise<Schedule[]> {
    return this.schedulesRepository.find({
      relations: ['vessel', 'route'],
    });
  }

  async findByPort(
    country: string,
    portName: string,
    date: string,
  ): Promise<any[]> {
    const dateObject = this.convertDateString(date);
    console.log('Search parameters:', { country, portName, date: dateObject });

    const schedules = await this.schedulesRepository.find({
      where: [
        {
          route: {
            departurePort: {
              country: ILike(`%${country}%`),
              name: ILike(`%${portName}%`),
            },
          },
          departure_time: MoreThanOrEqual(dateObject),
          status: In([ScheduleStatus.IN_TRANSIT, ScheduleStatus.SCHEDULED]),
        },
      ],
      relations: ['vessel', 'route'],
    });

    console.log('Schedules found:', schedules.length);
    return schedules.map((schedule) => ({
      ...schedule,
    }));
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: ['vessel', 'route'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(
    id: string,
    updateScheduleInput: UpdateScheduleInput,
  ): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: ['vessel', 'route'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    const vessel = await this.vesselsRepository.findOne({
      where: { id: schedule.vessel.id },
    });
    if (
      schedule.status === ScheduleStatus.SCHEDULED ||
      schedule.status === ScheduleStatus.IN_TRANSIT
    ) {
      schedule.status = updateScheduleInput.status;
    } else {
      throw new NotFoundException(`This schedule cannot update!`);
    }
    const savedSchedule = await this.schedulesRepository.save(schedule);
    if (
      schedule.status === ScheduleStatus.CANCELLED ||
      schedule.status === ScheduleStatus.COMPLETED
    ) {
      vessel.status = VesselStatus.AVAILABLE;
      await this.vesselsRepository.save(vessel);
    }

    return savedSchedule;
  }

  async remove(id: string): Promise<string> {
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: ['vessel', 'route'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    if (
      schedule.status === ScheduleStatus.SCHEDULED ||
      schedule.status === ScheduleStatus.IN_TRANSIT
    ) {
      throw new BadRequestException(`This Schedules can not deleted!`);
    } else {
      await this.schedulesRepository.delete(id);
      return id;
    }
  }

  async paginationSchedule(paginationSchedule: PaginationScheduleDto) {
    const { limit, offset, sort, statusFilter, search } = paginationSchedule;

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
      relations: ['route', 'vessel'],
      order,
    };

    const whereCondition: any = {};
    if (statusFilter) {
      const statusArray = statusFilter.split(',') as ScheduleStatus[];
      if (statusArray.length > 0) {
        whereCondition.status = In(statusArray);
      }
    }

    if (search) {
      whereCondition.vessel = {
        name: ILike(`%${search}%`),
      };
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }

    const [result, total] =
      await this.schedulesRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      schedules: result,
      totalCount: totalCount,
    };
  }
  async paginationScheduleById(paginationSchedule: PaginationScheduleByIdDto) {
    const { ownerId, limit, offset, sort, statusFilter, search } =
      paginationSchedule;
    const vesselIds = (
      await this.vesselsRepository.find({
        select: ['id'],
        where: { ownerId: ownerId },
      })
    ).map((vessel) => vessel.id);
    const skips = limit * offset;
    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      sort.split(',').forEach((sortParam: string) => {
        const [field, direction] = sortParam.split(' ');
        order[field] = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      });
    }

    const queryOptions: any = {
      take: limit,
      skip: skips,
      relations: ['route', 'vessel'],
      order,
    };

    const whereCondition: any = {};
    if (statusFilter) {
      const statusArray = statusFilter.split(',') as ScheduleStatus[];
      if (statusArray.length > 0) {
        whereCondition.status = In(statusArray);
      }
    }

    if (vesselIds && vesselIds.length > 0) {
      whereCondition.vessel = { id: In(vesselIds) }; // Add vesselId filtering
    }

    if (search) {
      whereCondition.vessel = {
        name: ILike(`%${search}%`),
      };
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }

    const [result, total] =
      await this.schedulesRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      schedules: result,
      totalCount: totalCount,
    };
  }
}
