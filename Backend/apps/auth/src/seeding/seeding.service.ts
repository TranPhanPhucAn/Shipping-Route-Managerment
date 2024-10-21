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
        // { permission: 'get:users', description: 'Get all users' }, //1
        { permission: 'get:usersPag', description: 'Get all users pagination' }, //1
        { permission: 'get:user', description: 'Get a user' }, //2
        { permission: 'update:user', description: 'Update a user' }, //3
        { permission: 'delete:user', description: 'Delete a user' }, //4
        {
          permission: 'create:permission',
          description: 'Create new permission',
        }, //5
        { permission: 'get:permissions', description: 'Get all permissions' }, //6
        {
          permission: 'update:permission',
          description: 'Update permission description',
        }, //7
        { permission: 'delete:permission', description: 'Delete a permission' }, //8
        { permission: 'create:role', description: 'Create new role' }, //9
        { permission: 'get:roles', description: 'Get all roles' }, //10
        { permission: 'get:role', description: 'Get a role' }, //11
        { permission: 'update:role', description: 'Update a role' }, //12
        {
          permission: 'assginPer:role',
          description: 'Assign permissions for role',
        }, //13
        { permission: 'assignRole:user', description: 'Assign role for user' }, //14
        { permission: 'delete:role', description: 'Delete a role' }, //15
        { permission: 'create:schedule', description: 'Create new schedule' }, //16
        { permission: 'get:schedules', description: 'Get all schedules' }, //17
        {
          permission: 'get:schedulesPag',
          description: 'Get all schedules pagination',
        }, //18
        {
          permission: 'get:schedulesPagById',
          description: 'Get all schedules pagination by owner id',
        }, //19
        {
          permission: 'update:schedule',
          description: 'Update status of schedule',
        }, //20
        { permission: 'search:schedule', description: 'Search a schedule' }, //21
        { permission: 'delete:schedule', description: 'Delete a schedule' }, //22
        { permission: 'create:port', description: 'Create new port' }, //23
        { permission: 'get:portsPag', description: 'Get all ports pagination' }, //24
        { permission: 'update:port', description: 'Update a port' }, //25
        { permission: 'delete:port', description: 'Delete a port' }, //26
        { permission: 'create:route', description: 'Create new route' }, //27
        // { permission: 'get:routes', description: 'Get all routes' }, //28
        {
          permission: 'get:routesPag',
          description: 'Get all routes pagination',
        }, //28
        { permission: 'update:route', description: 'Update a route' }, //29
        { permission: 'search:route', description: 'Search a route' }, //30
        { permission: 'delete:route', description: 'Delete a route' }, //31
        { permission: 'get:vessels', description: 'Get all vessels' }, //32
        {
          permission: 'get:vesselsPag',
          description: 'Get all vessels pagination',
        }, //33
        {
          permission: 'get:vesselsPagById',
          description: 'Get all vessels pagination by owner',
        }, //34
        { permission: 'create:vessel', description: 'Create new vessel' }, //35
        { permission: 'update:vessel', description: 'Update a vessel' }, //36
        { permission: 'delete:vessel', description: 'Delete a vessel' }, //37
        {
          permission: 'get:inforByOwner',
          description: 'Get vessel information by ownerId',
        }, //38
        {
          permission: 'get:inforVesselTotal',
          description: 'Get total vessel information',
        }, //39
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
          permissionsEntities[1],
          permissionsEntities[2],
          permissionsEntities[16],
          permissionsEntities[18],
          permissionsEntities[19],
          permissionsEntities[20],
          permissionsEntities[23],
          permissionsEntities[27],
          permissionsEntities[29],
          permissionsEntities[31],
          permissionsEntities[33],
          permissionsEntities[35],
          permissionsEntities[37],
        ],
      });
      const role3 = rolesRepository.create({
        name: 'user',
        description: 'User is basic role',
        permissions: [
          permissionsEntities[1],
          permissionsEntities[2],
          permissionsEntities[20],
          permissionsEntities[29],
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
        email: 'dung@gmail.com',
        username: 'Nguyen Xuan Dung',
        password: passwordHash,
        address: 'Ho Chi Minh',
        refreshToken: '',
        role: role2,
      });
      const user3 = usersRepository.create({
        email: 'huong@gmail.com',
        username: 'Phan Nguyen Huong',
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
