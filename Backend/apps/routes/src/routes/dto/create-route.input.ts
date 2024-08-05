import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  // @Field(() => ID)
  // id: string;

  @Field()
  departure: string;

  @Field()
  destination: string;

  @Field()
  transportation: string;

  @Field()
  duration: string;

  @Field()
  userId: string;
}
