/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity()
@Directive('@key(fields:"id")')
@ObjectType()
export class Route {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: string;

  @Column()
  @Field()
  departure: string;

  @Column()
  @Field()
  destination: string;

  @Column()
  @Field()
  transportation: string;

  @Column()
  @Field()
  duration: string;

  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: string;
}
