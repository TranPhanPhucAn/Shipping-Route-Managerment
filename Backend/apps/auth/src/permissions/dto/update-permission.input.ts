import { CreatePermissionInput } from './create-permission.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @Field()
  id: string;
}
