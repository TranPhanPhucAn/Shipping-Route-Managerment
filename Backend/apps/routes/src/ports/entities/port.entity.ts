import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Route } from '../../routes/entities/route.entity';

@ObjectType()
@Entity('ports')
export class Port {
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column()
  name: string;

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
