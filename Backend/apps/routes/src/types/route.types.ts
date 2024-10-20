import { Field, ObjectType } from '@nestjs/graphql';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Route } from '../routes/entities/route.entity';
import { Port } from '../ports/entities/port.entity';
import { Vessel } from '../vessels/entities/vessel.entity';

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
export class seedRouteResponse {
  @Field()
  message?: string;
}
@ObjectType()
export class PaginationScheduleResponse {
  @Field()
  totalCount?: number;

  @Field(() => [Schedule], { nullable: true })
  schedules?: Schedule[];
}

@ObjectType()
export class PaginationPortResponse {
  @Field()
  totalCount?: number;

  @Field(() => [Port], { nullable: true })
  ports?: Port[];
}

@ObjectType()
export class PaginationVesselResponse {
  @Field()
  totalCount?: number;

  @Field(() => [Vessel], { nullable: true })
  vessels?: Vessel[];
}

@ObjectType()
export class GetInforByOwnerResponse {
  @Field({ nullable: true })
  vesselTotal: number;

  @Field({ nullable: true })
  available: number;

  @Field({ nullable: true })
  inTransits: number;

  @Field({ nullable: true })
  underMaintance: number;
}

@ObjectType()
export class PaginationRouteResponse {
  @Field()
  totalCount?: number;

  @Field(() => [Route], { nullable: true })
  routes?: Route[];
}
