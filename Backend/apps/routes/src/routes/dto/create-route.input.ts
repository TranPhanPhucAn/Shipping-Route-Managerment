import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  @Field(() => String)
  @IsNotEmpty()
  departurePortId: string;

  @Field(() => String)
  @IsNotEmpty()
  destinationPortId: string;

  // @Field(() => Number)
  // @IsNumber()
  // @IsNotEmpty()
  // distance: number;
}

@InputType()
export class PaginationRoutesDto {
  @Field()
  @IsNotEmpty({ message: 'Limit is required' })
  limit: number;

  @Field()
  @IsNotEmpty({ message: 'Offset is required' })
  offset: number;

  @Field({ nullable: true })
  sort: string | null;

  @Field({ nullable: true })
  searchDep: string | null;

  @Field({ nullable: true })
  searchDes: string | null;
}
