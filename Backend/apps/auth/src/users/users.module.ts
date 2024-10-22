import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthenModule } from '../auth/authen.module';
import { JwtService } from '@nestjs/jwt';
import { UserGrpcServiceController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilesService } from '../files/files.service';
import { UserHttpController } from './upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => AuthenModule),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USER'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 60,
      }),
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: [process.env.BROKER_KAFKA],
          },
          consumer: {
            groupId: 'notification-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    JwtService,
    UserGrpcServiceController,
    FilesService,
    UserHttpController,
  ],
  exports: [UsersService],
  controllers: [UserHttpController],
})
export class UsersModule {}
