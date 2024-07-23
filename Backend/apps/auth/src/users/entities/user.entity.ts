/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  address: string;

  @Column({ type: 'jsonb', default: null })
  public passwordReset!: any;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  public updated_at!: Date;
}
