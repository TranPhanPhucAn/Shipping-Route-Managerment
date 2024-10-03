import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, ILike, In } from 'typeorm';
import { Schedule, ScheduleStatus } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { Vessel, VesselStatus } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';


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

  async create(createScheduleInput: CreateScheduleInput): Promise<Schedule> {
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
      throw new NotFoundException(`This vessel not available`);
    }
    const schedule = this.schedulesRepository.create({
      ...createScheduleInput,
      vessel,
      route,
    });

    const savedSchedule = await this.schedulesRepository.save(schedule);

    vessel.status = VesselStatus.IN_TRANSIT;
    await this.vesselsRepository.save(vessel);

    return savedSchedule;
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
    await this.schedulesRepository.delete(id);
    return id;
  }
}
