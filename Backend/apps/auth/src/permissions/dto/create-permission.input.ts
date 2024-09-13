import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePermissionInput {
  // @Field()
  // id: string;
  @Field()
  @IsNotEmpty({ message: 'Permission is required.' })
  permission: string;

  @Field()
  description: string;
}
