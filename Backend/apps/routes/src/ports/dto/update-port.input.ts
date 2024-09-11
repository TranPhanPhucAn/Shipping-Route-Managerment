import { CreatePortInput } from '../../ports/dto/create-port.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePortInput extends PartialType(CreatePortInput) {}
