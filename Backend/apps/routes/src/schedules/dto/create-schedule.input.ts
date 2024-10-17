import { IsNotEmpty, IsEnum } from 'class-validator';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ScheduleStatus } from '../entities/schedule.entity';

registerEnumType(ScheduleStatus, {
  name: 'ScheduleStatus',
  description: 'The status of the schedule',
});

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsNotEmpty()
  vesselId: string;

  @Field()
  @IsNotEmpty()
  routeId: string;

  @Field()
  @IsNotEmpty()
  departure_time: Date;

  @Field(() => ScheduleStatus, { defaultValue: ScheduleStatus.SCHEDULED })
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
