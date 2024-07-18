/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
@ObjectType()
export class Route {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
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
}
