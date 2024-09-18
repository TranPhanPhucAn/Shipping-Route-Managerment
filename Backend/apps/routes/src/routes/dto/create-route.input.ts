import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  @Field(() => String)
  @IsNotEmpty()
  departurePortId: string;

  @Field(() => String)
  @IsNotEmpty()
  destinationPortId: string;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  distance: number;
}
