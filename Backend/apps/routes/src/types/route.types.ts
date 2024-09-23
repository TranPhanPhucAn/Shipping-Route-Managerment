import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RouteUserResponse {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;
}
@ObjectType()
export class SeedResponse {
  @Field()
  message?: string;
}
