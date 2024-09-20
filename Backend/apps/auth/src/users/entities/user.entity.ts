/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  // UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
@Entity()
@ObjectType()
@Directive('@key(fields: "id")')
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
  password: string;

  @Column()
  @Field()
  address: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  refreshToken: string | null;

  @ManyToOne(() => Role, (role) => role.users, { cascade: true })
  @JoinColumn({ name: 'roleId' })
  @Field()
  role: Role;
}
