import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AssignPermissionDto {
  // @Field()
  // id: string;
  @Field()
  @IsNotEmpty({ message: 'RoleId is required.' })
  roleId: string;

  @Field(() => [String])
  updatePermissions: string[];
}
