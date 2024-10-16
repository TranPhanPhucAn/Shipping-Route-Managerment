import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VesselsService } from './vessels.service';
import { Vessel } from './entities/vessel.entity';
import { CreateVesselInput } from './dto/create-vessel.input';
import { UpdateVesselInput } from './dto/update-vessel.input';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissions.guard';
import { GetInforByOwnerResponse } from '../types/route.types';

@Resolver(() => Vessel)
export class VesselsResolver {
  constructor(private readonly vesselService: VesselsService) {}

  @SetMetadata('permissions', ['get:vessels'])
  @UseGuards(PermissionsGuard)
  @Query(() => [Vessel], { name: 'vessels' })
  findAll() {
    return this.vesselService.findAll();
  }

  @Query(() => Vessel, { name: 'vessel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vesselService.findOne(id);
  }

  @SetMetadata('permissions', ['create:vessel'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Vessel)
  createVessel(
    @Args('createVesselInput') createVesselInput: CreateVesselInput,
  ) {
    return this.vesselService.create(createVesselInput);
  }

  @SetMetadata('permissions', ['update:vessel'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Vessel)
  updateVessel(
    @Args('ID') id: string,
    @Args('updateVesselInput') updateVesselInput: UpdateVesselInput,
  ) {
    return this.vesselService.update(id, updateVesselInput);
  }

  @SetMetadata('permissions', ['delete:vessel'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => Vessel)
  removeVessel(@Args('id', { type: () => String }) id: string) {
    return this.vesselService.remove(id);
  }

  @SetMetadata('permissions', ['get:inforByOwner'])
  @UseGuards(PermissionsGuard)
  @Query(() => GetInforByOwnerResponse, { name: 'getInforByOwner' })
  getInforByOwner(@Args('id', { type: () => String }) id: string) {
    return this.vesselService.getInforByOwner(id);
  }

  @SetMetadata('permissions', ['get:inforVesselTotal'])
  @UseGuards(PermissionsGuard)
  @Query(() => GetInforByOwnerResponse, { name: 'getInforVesselTotal' })
  getInforVesselTotal() {
    return this.vesselService.getInforVesselTotal();
  }
}
