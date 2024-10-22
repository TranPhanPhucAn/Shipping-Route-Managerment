import { Injectable } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}
  async create(createPermissionInput: CreatePermissionInput) {
    const permissionNew = this.permissionsRepository.create();
    const newPermission = {
      ...permissionNew,
      ...createPermissionInput,
    };
    const permission: Permission | undefined =
      await this.permissionsRepository.save(newPermission);
    return permission;
  }

  async findAll() {
    return await this.permissionsRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    return await this.permissionsRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: string, updatePermissionInput: UpdatePermissionInput) {
    await this.permissionsRepository.update(id, updatePermissionInput);
    return await this.permissionsRepository.findOne({ where: { id: id } });
  }

  async remove(id: string) {
    const permission = this.permissionsRepository.findOne({
      where: { id: id },
    });
    if (!permission) {
      return {
        message: 'Permission is not exist',
      };
    }
    await this.permissionsRepository.delete(id);
    return {
      message: 'Delete permission succeed',
    };
  }
}
