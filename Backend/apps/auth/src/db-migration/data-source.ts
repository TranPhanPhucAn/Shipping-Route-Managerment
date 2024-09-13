import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.TYPE_DB as 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // entities: ['dist/apps/**/**/**/entities/*{.js,.ts}'],
  entities: [User, Role, Permission],
  migrations: ['migrations/**'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
