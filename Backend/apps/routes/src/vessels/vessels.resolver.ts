import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VesselsService } from './vessels.service';
import { Vessel } from './entities/vessel.entity';
import { CreateVesselInput } from './dto/create-vessel.input';
import { UpdateVesselInput } from './dto/update-vessel.input';

@Resolver(() => Vessel)
export class VesselsResolver {
  constructor(private readonly vesselService: VesselsService) {}

  @Query(() => [Vessel], { name: 'vessels' })
  findAll() {
    return this.vesselService.findAll();
  }

  @Query(() => Vessel, { name: 'vessel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vesselService.findOne(id);
  }

  @Mutation(() => Vessel)
  createVessel(
    @Args('createVesselInput') createVesselInput: CreateVesselInput,
  ) {
    return this.vesselService.create(createVesselInput);
  }

  @Mutation(() => Vessel)
  updateVessel(
    @Args('ID') id: string,
    @Args('updateVesselInput') updateVesselInput: UpdateVesselInput,
  ) {
    return this.vesselService.update(id, updateVesselInput);
  }

  @Mutation(() => Vessel)
  removeVessel(@Args('id', { type: () => String }) id: string) {
    return this.vesselService.remove(id);
  }
}
