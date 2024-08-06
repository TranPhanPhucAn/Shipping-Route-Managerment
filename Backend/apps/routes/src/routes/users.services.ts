import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserService {
  GetUser(data: {
    id: string;
  }): Observable<{ id: string; name: string; email: string }>;
}

@Injectable()
export class UserServiceClient implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  getUser(id: string) {
    return this.userService.GetUser({ id });
  }
}
