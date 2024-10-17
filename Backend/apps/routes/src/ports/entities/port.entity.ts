import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Route } from '../../routes/entities/route.entity';

@ObjectType()
@Entity('ports')
export class Port {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => [Route])
  @OneToMany(() => Route, (route) => route.departurePort)
  departureRoutes: Route[];

  @Field(() => [Route])
  @OneToMany(() => Route, (route) => route.destinationPort)
  destinationRoutes: Route[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
