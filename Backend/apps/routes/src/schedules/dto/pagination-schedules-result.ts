import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schedule } from '../entities/schedule.entity';

@ObjectType()
class PaginationMeta {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

@ObjectType()
export class PaginatedScheduleResult {
  @Field(() => [Schedule])
  items: Schedule[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
