import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class PaginationScheduleDto {
  @Field()
  @IsNotEmpty({ message: 'Limit is required' })
  limit: number;

  @Field()
  @IsNotEmpty({ message: 'Offset is required' })
  offset: number;

  @Field({ nullable: true })
  sort: string | null;

  @Field({ nullable: true })
  statusFilter: string | null;

  @Field({ nullable: true })
  search: string | null;
}

@InputType()
export class PaginationScheduleByIdDto {
  @Field()
  @IsNotEmpty({ message: 'Id is required' })
  ownerId: string;

  @Field()
  @IsNotEmpty({ message: 'Limit is required' })
  limit: number;

  @Field()
  @IsNotEmpty({ message: 'Offset is required' })
  offset: number;

  @Field({ nullable: true })
  sort: string | null;

  @Field({ nullable: true })
  statusFilter: string | null;

  @Field({ nullable: true })
  search: string | null;
}
