import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  // @Field()
  // id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  address: string;
}
