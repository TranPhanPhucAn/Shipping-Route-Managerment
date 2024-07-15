import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_db_username',
  password: 'your_db_password',
  database: 'your_db_name',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
