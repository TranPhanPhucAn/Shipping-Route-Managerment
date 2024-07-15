import { CreateRouteInput } from './create-route.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRouteInput extends PartialType(CreateRouteInput) {
  @Field(() => Int)
  id: number;
}
