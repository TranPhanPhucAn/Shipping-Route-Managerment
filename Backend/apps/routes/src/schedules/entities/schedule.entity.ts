import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Vessel } from '../../vessels/entities/vessel.entity';
import { Route } from '../../routes/entities/route.entity';

export enum ScheduleStatus {
  SCHEDULED = 'Scheduled',
  IN_TRANSIT = 'In Transit',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

registerEnumType(ScheduleStatus, {
  name: 'ScheduleStatus',
  description: 'The status of the schedule',
});

@ObjectType()
@Entity('schedules')
export class Schedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Vessel, { nullable: true })
  @ManyToOne(() => Vessel, (vessel) => vessel.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vesselId' })
  vessel: Vessel;

  @Field(() => Route)
  @ManyToOne(() => Route, (route) => route.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @Field()
  @Column()
  departure_time: string;

  @Field()
  @Column()
  arrival_time: string;

  @Field(() => ScheduleStatus)
  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.SCHEDULED,
  })
  status: ScheduleStatus;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
