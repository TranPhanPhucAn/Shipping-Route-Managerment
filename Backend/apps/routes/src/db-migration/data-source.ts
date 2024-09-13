import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Route } from '../routes/entities/route.entity';
import { Port } from '../ports/entities/port.entity';
import { Vessel } from '../vessels/entities/vessel.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.TYPE_DB as 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // entities: ['dist/apps/**/**/**/entities/*{.js,.ts}'],
  entities: [Route, Port, Vessel, Schedule],
  migrations: ['migrations/**'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
