/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  // UpdateDateColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
@Entity()
@ObjectType()
@Directive('@key(fields: "id")')
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permission' })
  @Field(() => [Permission])
  permissions?: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
