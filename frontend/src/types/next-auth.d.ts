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
    avatar_url: string;
    permissionNames: string[];
    loginMethod: string;
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
      avatar_url: string;
      permissionNames: string[];
      loginMethod: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
    username: string;
    address: string;
    expAccessToken: number;
    image_url: string;
    permissionNames: string[];
    loginMethod: string;
  }
}
