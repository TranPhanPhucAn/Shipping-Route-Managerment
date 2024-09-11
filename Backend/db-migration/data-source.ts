import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.TYPE_DB as 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/apps/**/**/**/entities/*{.js,.ts}'],
  migrations: ['migrations/**'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
