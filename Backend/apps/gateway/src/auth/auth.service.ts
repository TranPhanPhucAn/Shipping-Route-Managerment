import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient } from 'proto/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }
  getUser(id: string) {
    return firstValueFrom(this.userService.getUser({ id }));
  }
}
