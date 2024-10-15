import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import * as bycypt from 'bcrypt';
import { faker } from '@faker-js/faker';

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
      const permissions = [
        { permission: 'get:users', description: 'Get all users' }, //1
        { permission: 'get:usersPag', description: 'Get all users pagination' }, //2
        { permission: 'get:user', description: 'Get a user' }, //3
        { permission: 'update:user', description: 'Update a user' }, //4
        { permission: 'delete:user', description: 'Delete a user' }, //5
        {
          permission: 'create:permission',
          description: 'Create new permission',
        }, //6
        { permission: 'get:permissions', description: 'Get all permissions' }, //7
        {
          permission: 'update:permission',
          description: 'Update permission description',
        }, //8
        { permission: 'delete:permission', description: 'Delete a permission' }, //9
        { permission: 'create:role', description: 'Create new role' }, //10
        { permission: 'get:roles', description: 'Get all roles' }, //11
        { permission: 'get:role', description: 'Get a role' }, //12
        { permission: 'update:role', description: 'Update a role' }, //13
        {
          permission: 'assginPer:role',
          description: 'Assign permissions for role',
        }, //14
        { permission: 'assignRole:user', description: 'Assign role for user' }, //15
        { permission: 'delete:role', description: 'Delete a role' }, //16
        { permission: 'create:schedule', description: 'Create new schedule' }, //17
        { permission: 'get:schedules', description: 'Get all schedules' }, //18
        {
          permission: 'get:schedulesPag',
          description: 'Get all schedules pagination',
        }, //19
        {
          permission: 'update:schedule',
          description: 'Update status of schedule',
        }, //20
        { permission: 'search:schedule', description: 'Search a schedule' }, //21
        { permission: 'delete:schedule', description: 'Delete a schedule' }, //22
        { permission: 'create:port', description: 'Create new port' }, //23
        { permission: 'update:port', description: 'Update a port' }, //24
        { permission: 'delete:port', description: 'Delete a port' }, //25
        { permission: 'create:route', description: 'Create new route' }, //26
        { permission: 'get:routes', description: 'Get all routes' }, //27
        { permission: 'update:route', description: 'Update a route' }, //28
        { permission: 'search:route', description: 'Search a route' }, //29
        { permission: 'delete:route', description: 'Delete a route' }, //30
        { permission: 'get:vessels', description: 'Get all vessels' }, //31
        { permission: 'create:vessel', description: 'Create new vessel' }, //32
        { permission: 'update:vessel', description: 'Update a vessel' }, //33
        { permission: 'delete:vessel', description: 'Delete a vessel' }, //34
        {
          permission: 'get:inforByOwner',
          description: 'Get information by ownerId',
        }, //35
      ];
      const permissionsEntities = permissionsRepository.create(permissions);
      await permissionsRepository.save(permissionsEntities);
      const role1 = rolesRepository.create({
        name: 'admin',
        description: 'Admin can manage all resource',
        permissions: permissionsEntities,
      });
      const role2 = rolesRepository.create({
        name: 'supplier',
        description: 'Supplier manage route',
        permissions: [
          permissionsEntities[0],
          permissionsEntities[1],
          permissionsEntities[2],
          permissionsEntities[3],
          permissionsEntities[17],
          permissionsEntities[18],
          permissionsEntities[19],
          permissionsEntities[20],
          permissionsEntities[28],
          permissionsEntities[30],
          permissionsEntities[31],
          permissionsEntities[32],
          permissionsEntities[33],
          permissionsEntities[34],
        ],
      });
      const role3 = rolesRepository.create({
        name: 'user',
        description: 'User is basic role',
        permissions: [
          permissionsEntities[2],
          permissionsEntities[3],
          permissionsEntities[20],
          permissionsEntities[28],
        ],
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

      const usersfake = [];

      for (let i = 0; i < 100; i++) {
        const passwordHash = await bycypt.hash('123456', 10);
        const user = usersRepository.create({
          email: faker.internet.email(),
          username: faker.person.fullName(),
          password: passwordHash,
          address: faker.location.city(),
          phone_number: faker.phone.number(),
          role: faker.helpers.arrayElement([role1, role2, role3]),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          birthday: faker.date
            .birthdate({ min: 18, max: 65, mode: 'age' })
            .toISOString(),
          refreshToken: '',
        });

        usersfake.push(user);
      }
      await usersRepository.save(usersfake);
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
