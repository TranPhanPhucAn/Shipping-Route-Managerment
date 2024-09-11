import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesResolver } from './routes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
// import { UserServiceGrpcClient } from './users.services';
import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [
    RoutesResolver,
    RoutesService,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: 'localhost:50052', // URL where UserService is running
            package: 'user',
            // protoPath: 'apps/routes/src/routes/_proto/user.proto',
            // protoPath: join(__dirname, './routes/_proto/user.proto'),
            protoPath: 'dist/_proto/user.proto',
          },
        });
      },
    },
    // UserServiceGrpcClient,
  ],
})
export class RouteModule {}
