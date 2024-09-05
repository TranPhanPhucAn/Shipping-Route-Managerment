import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateVesselInput {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  capacity: number;

  @Field()
  userId: string;
}
