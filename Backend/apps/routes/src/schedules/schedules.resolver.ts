import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(private readonly scheduleService: SchedulesService) {}

  @Mutation(() => Schedule)
  async createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.scheduleService.create(createScheduleInput);
  }

  @Query(() => [Schedule], { name: 'schedules' })
  async findAll(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Query(() => Schedule, { name: 'schedule' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Mutation(() => Schedule)
  async updateSchedule(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ): Promise<Schedule> {
    return this.scheduleService.update(id, updateScheduleInput);
  }

  @Mutation(() => Schedule)
  async removeSchedule(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Schedule> {
    return this.scheduleService.remove(id);
  }
}
