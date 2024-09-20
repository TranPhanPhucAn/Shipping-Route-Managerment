import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, ScheduleStatus } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { Vessel, VesselStatus } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';

@Injectable()
export class SchedulesService {
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
    schedule.status = updateScheduleInput.status;
    const savedSchedule = await this.schedulesRepository.save(schedule);
    if (
      schedule.status != ScheduleStatus.IN_TRANSIT &&
      schedule.status != ScheduleStatus.SCHEDULED
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
