import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import * as bycypt from 'bcrypt';

@Injectable()
export class SeedingService {
  constructor(private readonly dataSource: DataSource) {}
  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const usersRepository = queryRunner.manager.getRepository(User);
      const rolesRepository = queryRunner.manager.getRepository(Role);
      const permissionsRepository =
        queryRunner.manager.getRepository(Permission);

      const users = await usersRepository.find();
      await usersRepository.remove(users);
      const roles = await rolesRepository.find();
      await rolesRepository.remove(roles);
      const permission = await permissionsRepository.find();
      await permissionsRepository.remove(permission);

      const permission1 = permissionsRepository.create({
        permission: 'get:users',
        description: 'Get all users',
      });
      const permission2 = permissionsRepository.create({
        permission: 'get:user',
        description: 'Get a user',
      });
      const permission3 = permissionsRepository.create({
        permission: 'update:user',
        description: 'Update a user',
      });
      const permission4 = permissionsRepository.create({
        permission: 'delete:user',
        description: 'Delete one user',
      });
      const permission5 = permissionsRepository.create({
        permission: 'create:permission',
        description: 'Create new permission',
      });
      const permission6 = permissionsRepository.create({
        permission: 'delete:permission',
        description: 'Delete a permission',
      });
      const permission7 = permissionsRepository.create({
        permission: 'create:role',
        description: 'Create new role',
      });
      const permission8 = permissionsRepository.create({
        permission: 'update:role',
        description: 'Update a role',
      });
      const permission9 = permissionsRepository.create({
        permission: 'assginPer:role',
        description: 'Assign permissions for role',
      });
      const permission10 = permissionsRepository.create({
        permission: 'assignRole:user',
        description: 'Assign role for user',
      });
      await permissionsRepository.save([
        permission1,
        permission2,
        permission3,
        permission4,
        permission5,
        permission6,
        permission7,
        permission8,
        permission9,
        permission10,
      ]);

      const role1 = rolesRepository.create({
        name: 'admin',
        description: 'Admin can manage all resource',
        permissions: [
          permission1,
          permission2,
          permission3,
          permission4,
          permission5,
          permission6,
          permission7,
          permission8,
          permission9,
          permission10,
        ],
      });
      const role2 = rolesRepository.create({
        name: 'supplier',
        description: 'Supplier manage route',
        permissions: [permission1, permission2],
      });
      const role3 = rolesRepository.create({
        name: 'user',
        description: 'User is basic role',
        permissions: [permission1, permission2],
      });
      await rolesRepository.save([role1, role2, role3]);
      const passwordHash = await bycypt.hash('123456', 10);
      const user1 = usersRepository.create({
        email: 'tranphanphucan97@gmail.com',
        username: 'Tran Phan Phuc An',
        password: passwordHash,
        address: 'Thua Thien Hue',
        refreshToken: '',
        role: role1,
      });
      const user2 = usersRepository.create({
        email: 'name@gmail.com',
        username: 'Nguyen Van A',
        password: passwordHash,
        address: 'Ho Chi Minh',
        refreshToken: '',
        role: role2,
      });
      const user3 = usersRepository.create({
        email: 'b@gmail.com',
        username: 'Phan Nguyen B',
        password: passwordHash,
        address: 'Ha Noi',
        refreshToken: '',
        role: role3,
      });
      await usersRepository.save([user1, user2, user3]);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('error', e);
      throw e;
    } finally {
      await queryRunner.release();
      return { message: 'Seeding done' };
    }
  }
}
