import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LoginInput, LoginInputGoogle } from './dto/auth.dto';
import { LoginResponseService } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
// import { AuthenticationError } from 'apollo-server-express';
import * as bycypt from 'bcrypt';
import { JWTPayload } from './interfaces/jwtPayLoad.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GraphQLError } from 'graphql';
import { Role } from '../roles/entities/role.entity';
import { OAuth2Client } from 'google-auth-library';
import { Permission } from '../permissions/entities/permission.entity';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  loginUserByPassword = async (
    loginInput: LoginInput,
  ): Promise<LoginResponseService | undefined> => {
    let user: User | undefined;
    if (loginInput.email) {
      user = await this.userService.findOneByEmail(loginInput.email);
      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            errorCode: '5001-1',
          },
        });
      }
    }
    let isMatch: boolean = false;
    try {
      isMatch = await this.comparePassword(loginInput.password, user.password);
    } catch (err) {
      console.log(err);
    }
    if (isMatch) {
      const { token, expAccessToken } = this.createAccessToken(user);
      const refreshToken = this.createRefreshToken(user).token;
      this.usersRepository.update(user.id, { refreshToken: refreshToken });
      const permissions = await this.permissionsRepository.find({
        where: {
          roles: {
            id: user.role.id,
          },
        },
      });
      const permissionNames = permissions.map(
        (permission) => permission.permission,
      );

      return {
        user,
        accessToken: token,
        refreshToken: refreshToken,
        expAccessToken: expAccessToken,
        permissionNames: permissionNames,
      };
    }
    throw new GraphQLError('Invalid email or password', {
      extensions: {
        errorCode: '5001-1',
      },
    });
  };

  loginUserByGoogle = async (loginInputGoogle: LoginInputGoogle) => {
    let user: User | undefined;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    if (loginInputGoogle.email) {
      user = await this.userService.findOneByEmail(loginInputGoogle.email);
      if (!user) {
        let ticket;
        try {
          ticket = await client.verifyIdToken({
            idToken: loginInputGoogle.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
        } catch (err) {
          console.log('err: ', err);
          throw new GraphQLError('Error verify Google account', {
            extensions: {
              errorCode: '5001-12',
            },
          });
        }
        const payload = ticket.getPayload();
        console.log('payload: ', payload);
        if (payload.email != loginInputGoogle.email) {
          throw new GraphQLError('Error verify Google account', {
            extensions: {
              errorCode: '5001-13',
            },
          });
        }

        const roleRegister = await this.rolesRepository.findOne({
          where: { id: '3' },
        });
        const userEntity = this.usersRepository.create();
        let createUser = {
          ...userEntity,
          email: payload.email,
          password: '',
          address: '',
          username: payload.name,
          image_url: payload.picture,
          role: roleRegister,
        };
        const { token, expAccessToken } = this.createAccessToken(createUser);
        const refreshToken = this.createRefreshToken(createUser).token;
        createUser = {
          ...createUser,
          refreshToken: refreshToken,
        };
        const newUser: User | undefined =
          await this.usersRepository.save(createUser);
        const permissions = await this.permissionsRepository.find({
          where: {
            roles: {
              id: newUser.role.id,
            },
          },
        });
        const permissionNames = permissions.map(
          (permission) => permission.permission,
        );
        return {
          user: newUser,
          accessToken: token,
          refreshToken: refreshToken,
          expAccessToken: expAccessToken,
          permissionNames: permissionNames,
        };
      } else {
        if (user.password) {
          throw new GraphQLError('You signed up by other method', {
            extensions: {
              errorCode: '5001-14',
            },
          });
        }
        try {
          await client.verifyIdToken({
            idToken: loginInputGoogle.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          const { token, expAccessToken } = this.createAccessToken(user);
          const refreshToken = this.createRefreshToken(user).token;
          this.usersRepository.update(user.id, { refreshToken: refreshToken });
          const permissions = await this.permissionsRepository.find({
            where: {
              roles: {
                id: user.role.id,
              },
            },
          });
          const permissionNames = permissions.map(
            (permission) => permission.permission,
          );
          return {
            user: user,
            accessToken: token,
            refreshToken: refreshToken,
            expAccessToken: expAccessToken,
            permissionNames: permissionNames,
          };
        } catch (err) {
          console.log('err: ', err);
          throw new GraphQLError('Error verify Google account', {
            extensions: {
              errorCode: '5001-12',
            },
          });
        }
      }
    }
  };

  logoutUser = async (req: any) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const ttlCache = +req.expirationtime - currentTime;
    await this.usersRepository.update(req.headers.userid, { refreshToken: '' });
    await this.cacheManager.set(req.cookies['access_token'], 'true', {
      ttl: ttlCache,
    });
    const cacheKey = `user-${req.headers.userid}`;
    await this.cacheManager.del(cacheKey);
    return { message: 'Logout out successfull' };
  };

  createAccessToken(user: User): {
    data: JWTPayload;
    token: string;
    expAccessToken: number;
  } {
    const data: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      // permission: user.permission,
    };
    const jwt = this.jwtService.sign(data);
    const decodedToken = this.jwtService.decode(jwt) as { exp: number };
    return {
      data,
      token: jwt,
      expAccessToken: decodedToken.exp,
    };
  }
  createRefreshToken(user: User): { data: JWTPayload; token: string } {
    const data: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    const jwt = this.jwtService.sign(data, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.EXPIRES_IN_REFRESH,
    });
    return {
      data,
      token: jwt,
    };
  }
  private async comparePassword(enteredPassword, dbPassword) {
    return await bycypt.compare(enteredPassword, dbPassword);
  }

  async validateJWTPayLoad(payload: JWTPayload): Promise<User | undefined> {
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      // user.updated_at = new Date();
      return user;
    }
    return undefined;
  }

  refreshToken = async (user: any) => {
    const payload = {
      userId: user.userId,
      email: user.email,
      username: user.username,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.EXPIRES_IN_REFRESH,
    });
    const decodedToken = this.jwtService.decode(accessToken) as { exp: number };

    this.usersRepository.update(user.userId, {
      refreshToken: refreshToken,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expAccessToken: decodedToken.exp,
    };
  };
}
