import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Mutation(() => Schedule)
  createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.schedulesService.create(createScheduleInput);
  }

  @Query(() => [Schedule], { name: 'schedules' })
  findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Schedule> {
    return this.schedulesService.findOne(id);
  }

  @Mutation(() => Schedule)
  updateSchedule(
    @Args('id', { type: () => String }) id: string,
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ): Promise<Schedule> {
    return this.schedulesService.update(id, updateScheduleInput);
  }

  @Mutation(() => String)
  async removeSchedule(@Args('id') id: string): Promise<string> {
    return this.schedulesService.remove(id);
  }
}
