import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

interface GetUserRequest {
  id: string;
}

interface GetUserResponse {
  id: string;
  name: string;
  email: string;
}

@Controller()
export class UserServiceController {
  constructor(private readonly usersService: UsersService) {}
  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserRequest, metadata: any): Promise<GetUserResponse> {
    // Simulate fetching user data
    console.log('abcxyz');
    const result = await this.usersService.findOneById(data.id);
    const { id, username, email } = result;
    return {
      id: id,
      name: username,
      email: email,
    };
    // return this.usersService.findOneById(data.id);
  }
}
