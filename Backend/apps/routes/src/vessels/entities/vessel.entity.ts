import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../routes/entities/user.entity';

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
