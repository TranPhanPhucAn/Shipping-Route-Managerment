import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Vessel } from '../../vessels/entities/vessel.entity';
import { Route } from '../../routes/entities/route.entity';

@ObjectType()
@Entity()
export class Schedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @ManyToOne(() => Vessel, (vessel) => vessel.id, { nullable: false })
  vessel_Id: Vessel;

  @Field(() => Route)
  @ManyToOne(() => Route, (route) => route.id, { nullable: false })
  route_Id: Route;

  @Field()
  @Column()
  departure_time: Date;

  @Field()
  @Column()
  arrival_time: Date;

  @Field()
  @Column({
    type: 'enum',
    enum: ['Scheduled', 'In Transit', 'Completed', 'Cancelled'],
  })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
