import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Route } from './route.entity';

@ObjectType()
// @Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  // @Directive('@external')
  id: string;

  @Field(() => [Route])
  routes?: Route[];
}
