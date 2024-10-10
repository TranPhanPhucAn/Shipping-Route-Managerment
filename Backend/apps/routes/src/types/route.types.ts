import { Field, ObjectType } from '@nestjs/graphql';
import { Schedule } from '../schedules/entities/schedule.entity';

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
