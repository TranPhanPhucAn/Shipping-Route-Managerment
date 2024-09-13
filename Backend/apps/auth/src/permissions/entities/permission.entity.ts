/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  // UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
@Entity()
@ObjectType()
@Directive('@key(fields: "id")')
export class Permission {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  permission: string;

  @Column()
  @Field()
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
