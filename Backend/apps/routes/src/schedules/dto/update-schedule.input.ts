import { InputType, Field } from '@nestjs/graphql';
import { ScheduleStatus } from '../entities/schedule.entity';
import { IsEnum } from 'class-validator';
// import { CreateScheduleInput } from './create-schedule.input';

@InputType()
export class UpdateScheduleInput {
  @Field(() => ScheduleStatus, { defaultValue: ScheduleStatus.SCHEDULED })
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
