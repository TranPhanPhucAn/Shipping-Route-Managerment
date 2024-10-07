import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { AssignPermissionDto } from './dto/role.dto';
import { DeleteRoleResponse } from '../types/auth.types';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['create:role'])
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    return this.rolesService.create(createRoleInput);
  }

  @Query(() => [Role], { name: 'roles' })
  @SetMetadata('permissions', ['get:roles'])
  @UseGuards(PermissionsGuard)
  findAll() {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { name: 'role' })
  findOne(@Args('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Mutation(() => Role)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['update:role'])
  updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.rolesService.update(updateRoleInput.id, updateRoleInput);
  }

  @Mutation(() => DeleteRoleResponse)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['delete:role'])
  removeRole(@Args('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Mutation(() => Role)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['assginPer:role'])
  assignPerForRole(
    @Args('assignPermissionDto') assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolesService.assginPerForRole(assignPermissionDto);
  }
}
