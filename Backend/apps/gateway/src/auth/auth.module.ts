import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // The name used for injection
        transport: Transport.GRPC, // Specifies that this is a gRPC service
        options: {
          package: 'user', // Name of the package in your proto file
          protoPath: join(__dirname, './_proto/user.proto'), // Path to your proto file
          url: 'localhost:50052', // The URL of the gRPC server
        },
      },
    ]),
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService, ClientsModule],
})
export class AuthModule {}
