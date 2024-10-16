import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {  VesselType } from '../entities/vessel.entity';

@InputType()
export class CreateVesselInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => VesselType)
  @IsEnum(VesselType)
  type: VesselType;

  @Field()
  @IsNotEmpty()
  capacity: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  ownerId: string;
}
