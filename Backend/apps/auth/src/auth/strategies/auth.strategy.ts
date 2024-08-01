import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../interfaces/jwtPayLoad.interface';
import { AuthenticationError } from 'apollo-server-express';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    console.log('check layload: ', payload);
    const user = await this.authService.validateJWTPayLoad(payload);
    if (!user) {
      throw new AuthenticationError(`Please login first`);
    }
    return user;
  }
}
