import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: 'localhost:50052', // URL where UserService is running
            package: 'user',
            // protoPath: 'apps/routes/src/routes/_proto/user.proto',
            protoPath: join(__dirname, './_proto/user.proto'),
          },
        });
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
