import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // The name used for injection
        transport: Transport.GRPC, // Specifies that this is a gRPC service
        options: {
          package: 'user', // Name of the package in your proto file
          // protoPath: join(__dirname, '../_proto/user.proto'), // Path to your proto file

          protoPath: join(__dirname, '_proto/user.proto'), // Path to your proto file

          // protoPath: 'dist/_proto/user.proto',

          url: 'localhost:50052', // The URL of the gRPC server
        },
      },
    ]),
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
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService, ClientsModule, CacheModule],
})
export class AuthModule {}
