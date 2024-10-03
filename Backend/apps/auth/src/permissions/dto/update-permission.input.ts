import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput {
  @Field()
  id: string;

  @Field()
  description: string;
}
