import { CreateVesselInput } from './create-vessel.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVesselInput extends PartialType(CreateVesselInput) {
  @Field()
  id: string;
}
