import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Port } from '../../ports/entities/port.entity';

@ObjectType()
@Entity('routes')
@Unique(['departurePort', 'destinationPort'])
export class Route {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Port)
  @ManyToOne(() => Port, (port) => port.departureRoutes, { eager: true })
  @JoinColumn({ name: 'departurePortId' })
  departurePort: Port;

  @Field(() => Port)
  @ManyToOne(() => Port, (port) => port.destinationRoutes, { eager: true })
  @JoinColumn({ name: 'destinationPortId' })
  destinationPort: Port;

  @Field(() => Number)
  @Column()
  distance: number;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
