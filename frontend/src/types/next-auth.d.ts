import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     id: string;
//     username: string;
//     address: string;
//   }

//   interface User {
//     id: string;
//     username: string;
//     address: string;
//   }
// }

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    address: string;
    expAccessToken: number;
    isLogin: boolean;
  }
}

import { DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      username: string;
      address: string;
      expAccessToken: number;
      isLogin: boolean;
    };
  }
  interface User extends DefaultUser {
    id: string;
    username: string;
    address: string;
    expAccessToken: number;
  }
}
