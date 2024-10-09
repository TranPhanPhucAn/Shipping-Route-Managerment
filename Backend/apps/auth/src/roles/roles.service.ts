import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/role.dto';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionssRepository: Repository<Permission>,
  ) {}
  async create(createRoleInput: CreateRoleInput) {
    const userRole = await this.rolesRepository.findOne({
      where: { id: '3' },
      relations: ['permissions'], // Make sure to fetch the permissions relationship
    });

    const roleNew = this.rolesRepository.create();
    const newRole = {
      ...roleNew,
      ...createRoleInput,
      permissions: userRole.permissions,
    };
    const role: Role | undefined = await this.rolesRepository.save(newRole);
    return role;
  }

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findOne(id: string) {
    return await this.rolesRepository.findOne({
      relations: ['permissions'],
      where: { id: id },
    });
  }

  async update(id: string, updateRoleInput: UpdateRoleInput) {
    await this.rolesRepository.update(id, updateRoleInput);
    return await this.rolesRepository.findOne({ where: { id: id } });
  }

  async remove(id: string) {
    const role = this.rolesRepository.findOne({
      where: { id: id },
    });
    if (!role) {
      return {
        message: 'Role is not exist',
      };
    }
    await this.rolesRepository.delete(id);
    return {
      message: 'Delete role succeed',
    };
  }
  async assginPerForRole(assignPermissionDto: AssignPermissionDto) {
    const role = await this.rolesRepository.findOne({
      where: { id: assignPermissionDto.roleId },
    });
    const permissions = await this.permissionssRepository.find({
      where: { id: In(assignPermissionDto.updatePermissions) },
    });
    role.permissions = permissions;
    await this.rolesRepository.save(role);
    return role;
  }
}
