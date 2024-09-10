import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleInput: CreateScheduleInput): Promise<Schedule> {
    const newSchedule = this.scheduleRepository.create(createScheduleInput);
    return this.scheduleRepository.save(newSchedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ relations: ['vessel', 'route'] });
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: ['vessel', 'route'],
    });
  }

  async update(
    id: string,
    updateScheduleInput: UpdateScheduleInput,
  ): Promise<Schedule> {
    await this.scheduleRepository.update(id, updateScheduleInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Schedule> {
    const schedule = await this.findOne(id);
    if (schedule) {
      await this.scheduleRepository.remove(schedule);
      return schedule;
    }
    return null;
  }
}
