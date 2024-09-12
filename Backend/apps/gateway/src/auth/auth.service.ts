import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
// import { UserServiceClient } from 'proto/user';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserServiceClient } from '../proto/user';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }
  getUser(id: string) {
    return firstValueFrom(this.userService.getUser({ id }));
  }
  public getCacheService() {
    return this.cacheManager;
  }
}
