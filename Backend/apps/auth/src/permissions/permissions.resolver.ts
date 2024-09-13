import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { DeletePermissionResponse } from '../types/auth.types';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => Permission)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['create:permission'])
  createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ) {
    return this.permissionsService.create(createPermissionInput);
  }

  @Query(() => [Permission], { name: 'permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Query(() => Permission, { name: 'permission' })
  findOne(@Args('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Mutation(() => Permission)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['update:permission'])
  updatePermission(
    @Args('updatePermissionInput') updatePermissionInput: UpdatePermissionInput,
  ) {
    return this.permissionsService.update(
      updatePermissionInput.id,
      updatePermissionInput,
    );
  }

  @Mutation(() => DeletePermissionResponse)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['delete:permission'])
  removePermission(@Args('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
