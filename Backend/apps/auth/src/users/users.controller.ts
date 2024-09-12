import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  GetUserRequest,
  // GetUserResponse,
  UserServiceControllerMethods,
} from '../proto/user';
// import { UserServiceController } from 'proto/user';
// import { Observable } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserServiceController } from '../proto/user';
@Controller()
@UserServiceControllerMethods()
export class UserGrpcServiceController implements UserServiceController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @GrpcMethod('UserService', 'GetUser')
  // @UseInterceptors(CacheInterceptor)
  async getUser(data: GetUserRequest) {
    // Simulate fetching user data
    // const result = this.usersService.findOneById(data.id);
    // const { id, username, email } = result;
    // return {
    //   id: id,
    //   name: username,
    //   email: email,
    // };
    const cacheKey = `user-${data.id}`;
    const cachedUser = await this.cacheManager.get(cacheKey);
    if (cachedUser) {
      console.log('Returning cached data');
      return cachedUser;
    }
    const result = await this.usersService.findOneByIdService(data.id);
    await this.cacheManager.set(cacheKey, result, { ttl: 60 });
    return result;
    // this.cacheManager.set('test', 'Hello', { ttl: 60 });
    // return await this.usersService.findOneByIdService(data.id);
  }
}
