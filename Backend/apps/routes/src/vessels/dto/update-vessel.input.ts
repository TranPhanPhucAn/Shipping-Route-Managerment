import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType} from '@nestjs/graphql';
import { VesselStatus, VesselType } from '../entities/vessel.entity';

@InputType()
export class UpdateVesselInput {
@Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => VesselType)
  @IsEnum(VesselType)
  type: VesselType;

  @Field()
  @IsNotEmpty()
  capacity: number;
    
  @Field(() => VesselStatus, { defaultValue: VesselStatus.AVAILABLE })
  @IsEnum(VesselStatus)
  status: VesselStatus;
}
