// import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
// import { User } from './entities/user.entity';
import { RoutesService } from './routes.service';
// import { Route } from './entities/route.entity';

// @Resolver(() => User)
export class UsersResolver {
  constructor(private readonly routesService: RoutesService) {}

  // @ResolveField(() => [Route])
  // routes(@Parent() user: User): Promise<Route[]> {
  //   return this.routesService.forUser(user.id);
  // }
}
