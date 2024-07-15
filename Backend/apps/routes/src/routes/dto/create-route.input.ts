import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRouteInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
