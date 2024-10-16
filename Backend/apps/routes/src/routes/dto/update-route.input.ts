
import { CreateRouteInput } from './create-route.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRouteInput extends PartialType(CreateRouteInput) {

}
