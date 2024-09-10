import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'apps/auth/src/users/entities/user.entity';
import { Role } from 'apps/auth/src/roles/entities/role.entity';
import { Permission } from 'apps/auth/src/permissions/entities/permission.entity';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  // type: process.env.TYPE_DB as 'postgres',
  // host: process.env.HOST,
  // port: parseInt(process.env.POSTGRES_PORT, 10),
  // username: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DB,
  // entities: [User, Role, Permission],
  entities: ['dist/apps/**/**/**/entities/*{.js,.ts}'],
  // migrations: ['dist/db-migration/*{.js,.ts}'],

  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'db',
  migrations: ['migrations/**'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
