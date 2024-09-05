import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Port } from '../../ports/entities/port.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Route {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Port)
  @ManyToOne(() => Port, { eager: true })
  @JoinColumn({ name: 'departure_port_name' })
  departurePort: Port;

  @Field(() => Port)
  @ManyToOne(() => Port, { eager: true })
  @JoinColumn({ name: 'destination_port_name' })
  destinationPort: Port;

  @Field()
  @Column('float')
  distance: number;

  @Field()
  @Column('int')
  estimatedTime: number;

  @Field()
  @Column('float')
  price: number;

  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
