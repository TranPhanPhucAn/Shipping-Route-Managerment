import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import {
  PaginationScheduleByIdDto,
  PaginationScheduleDto,
} from './dto/pagination-schedules';
import { PaginationScheduleResponse } from '../types/route.types';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissions.guard';

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(private readonly schedulesService: SchedulesService) {}

  @SetMetadata('permissions', ['create:schedule'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Schedule)
  createSchedule(
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.schedulesService.create(createScheduleInput);
  }

  @SetMetadata('permissions', ['get:schedules'])
  @UseGuards(PermissionsGuard)
  @Query(() => [Schedule], { name: 'schedules' })
  findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Query(() => [Schedule], { name: 'schedulesByPort' })
  schedulesByPort(
    @Args('country', { type: () => String }) country: string,
    @Args('portName', { type: () => String }) portName: string,
    @Args('date', { type: () => String }) date: string,
  ): Promise<Schedule[]> {
    return this.schedulesService.findByPort(country, portName, date);
  }

  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Schedule> {
    return this.schedulesService.findOne(id);
  }

  @SetMetadata('permissions', ['update:schedule'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Schedule)
  updateSchedule(
    @Args('id', { type: () => String }) id: string,
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput,
  ): Promise<Schedule> {
    return this.schedulesService.update(id, updateScheduleInput);
  }

  @SetMetadata('permissions', ['delete:schedule'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => String)
  async removeSchedule(@Args('id') id: string): Promise<string> {
    return this.schedulesService.remove(id);
  }

  @SetMetadata('permissions', ['get:schedulesPag'])
  @UseGuards(PermissionsGuard)
  @Query(() => PaginationScheduleResponse, { name: 'paginationSchedule' })
  paginationSchedule(
    @Args('paginationSchedule') paginationSchedule: PaginationScheduleDto,
  ) {
    return this.schedulesService.paginationSchedule(paginationSchedule);
  }

  @SetMetadata('permissions', ['get:schedulesPagById'])
  @UseGuards(PermissionsGuard)
  @Query(() => PaginationScheduleResponse, { name: 'paginationScheduleById' })
  paginationScheduleById(
    @Args('paginationSchedule') paginationSchedule: PaginationScheduleByIdDto,
  ) {
    return this.schedulesService.paginationScheduleById(paginationSchedule);
  }
}
