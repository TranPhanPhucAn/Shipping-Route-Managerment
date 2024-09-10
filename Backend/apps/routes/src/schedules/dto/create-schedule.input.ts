import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

enum ScheduleStatus {
  SCHEDULED = 'Scheduled',
  IN_TRANSIT = 'In Transit',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  vesselId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  routeId: string;

  @Field()
  @IsNotEmpty()
  departure_time: Date;

  @Field()
  @IsNotEmpty()
  arrival_time: Date;

  @Field()
  @IsNotEmpty()
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
