import { IsNotEmpty, IsUUID, IsInt, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  @Field()
  @IsNotEmpty()
  departurePortName: string;

  @Field()
  @IsNotEmpty()
  destinationPortName: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  estimated_time: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
