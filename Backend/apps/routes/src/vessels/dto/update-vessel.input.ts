import { CreateVesselInput } from './create-vessel.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVesselInput extends PartialType(CreateVesselInput) {}
