import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  // UpdateDateColumn,
  Unique,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Port } from '../../ports/entities/port.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@ObjectType()
@Entity('routes')
@Unique(['departurePort', 'destinationPort'])
export class Route {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Port)
  @ManyToOne(() => Port, (port) => port.departureRoutes, { eager: true , onDelete: 'CASCADE' })
  @JoinColumn({ name: 'departurePortId' })
  departurePort: Port;

  @Field(() => Port)
  @ManyToOne(() => Port, (port) => port.destinationRoutes, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'destinationPortId' })
  destinationPort: Port;

  @Field(() => Float)
  @Column('double precision')
  distance: number;

  @Field()
  @Column('int', { nullable: true, default: 0 })
  estimatedTimeDays: number;  

  @Field(() => [Schedule])
  @OneToMany(() => Schedule, (schedule) => schedule.route)
  schedules: Schedule[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  // @Field()
  // @Column()
  // @UpdateDateColumn()
  // updatedAt: Date;
}
