import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  // @Field()
  // id: string;
  @Field()
  @IsNotEmpty({ message: 'Role is required.' })
  name: string;

  @Field()
  description: string;
}
