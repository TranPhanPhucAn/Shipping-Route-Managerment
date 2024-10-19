import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class PaginationPortDto {
  @Field()
  @IsNotEmpty({ message: 'Limit is required' })
  limit: number;

  @Field()
  @IsNotEmpty({ message: 'Offset is required' })
  offset: number;

  @Field({ nullable: true })
  sort: string | null;

  @Field({ nullable: true })
  search: string | null;
}
