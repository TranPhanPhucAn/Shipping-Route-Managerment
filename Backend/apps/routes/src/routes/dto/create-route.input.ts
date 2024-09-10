import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  @Field()
  @IsNotEmpty()
  departurePort: string;

  @Field()
  @IsNotEmpty()
  destinationPort: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  estimatedTime: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  // @Field()
  // @IsNotEmpty()
  // @IsUUID()
  // userId: string;
}
