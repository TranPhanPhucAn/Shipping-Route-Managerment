import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Route } from './route.entity';

@ObjectType()
// @Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  // @Directive('@external')
  id: string;

  @Field((type) => [Route])
  routes?: Route[];
}
