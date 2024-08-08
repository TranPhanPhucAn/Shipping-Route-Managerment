import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  GetUserRequest,
  GetUserResponse,
  UserServiceControllerMethods,
} from 'proto/user';
import { UserServiceController } from 'proto/user';
import { Observable } from 'rxjs';
@Controller()
@UserServiceControllerMethods()
export class UserGrpcServiceController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}
  // @GrpcMethod('UserService', 'GetUser')
  getUser(
    data: GetUserRequest,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse {
    // Simulate fetching user data
    // const result = this.usersService.findOneById(data.id);
    // const { id, username, email } = result;
    // return {
    //   id: id,
    //   name: username,
    //   email: email,
    // };
    return this.usersService.findOneByIdService(data.id);
  }
}
