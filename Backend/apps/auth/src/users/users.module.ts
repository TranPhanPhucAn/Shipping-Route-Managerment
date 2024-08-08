import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthenModule } from '../auth/authen.module';
import { JwtService } from '@nestjs/jwt';
import { UserGrpcServiceController } from './users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthenModule)],
  providers: [
    UsersResolver,
    UsersService,
    JwtService,
    UserGrpcServiceController,
  ],
  exports: [UsersService],
})
export class UsersModule {}
