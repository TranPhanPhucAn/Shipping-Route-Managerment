import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Schedule } from '../../schedules/entities/schedule.entity';

export enum VesselStatus {
  AVAILABLE = 'AVAILABLE',
  IN_TRANSIT = 'IN_TRANSIT',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
}
registerEnumType(VesselStatus, {
  name: 'VesselStatus',
  description: 'The current operational status of the vessel',
});
@ObjectType()
@Entity()
export class Vessel {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  capacity: number;

  @Field(() => String)
  @Column()
  ownerId: string;

  @Field(() => VesselStatus)
  @Column({
    type: 'enum',
    enum: VesselStatus,
    default: VesselStatus.AVAILABLE,
  })
  status: VesselStatus;

  @Field(() => [Schedule], { nullable: 'items' })
  @OneToMany(() => Schedule, (schedule) => schedule.vessel)
  schedules: Schedule[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
