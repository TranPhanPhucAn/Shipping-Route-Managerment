// import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
// import { ClientGrpc } from '@nestjs/microservices';
// import { UserServiceClient } from 'proto/user';
// // import { Observable } from 'rxjs';

// // interface UserService {
// //   GetUser(data: {
// //     id: string;
// //   }): Observable<{ id: string; name: string; email: string }>;
// // }

// @Injectable()
// export class UserServiceGrpcClient implements OnModuleInit {
//   private userService: UserServiceClient;

//   constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

//   onModuleInit() {
//     this.userService = this.client.getService<UserServiceClient>('UserService');
//   }

//   getUser(id: string) {
//     return this.userService.getUser({ id });
//   }
// }
