import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import * as dotenv from 'dotenv';
import { JWTStrategy } from './strategies/auth.strategy';
dotenv.config();
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthResolver, AuthService, JWTStrategy],
  exports: [AuthService],
})
export class AuthenModule {}
