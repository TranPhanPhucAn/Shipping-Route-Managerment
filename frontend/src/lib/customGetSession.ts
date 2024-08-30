// import { getServerSession } from "next-auth";
// import { nextAuthOptions } from "../pages/api/auth/[...nextauth]";
// import { cookies } from "next/headers";
// import { NextApiRequest, NextApiResponse } from "next";

// export async function getSessionCustom(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // Pass in the NextApiRequest and NextApiResponse to getServerSession
//   return await getServerSession(req, res, nextAuthOptions(req, res));
// }

import { cookies, headers } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../pages/api/auth/[...nextauth]";

export async function getServerSessionFromApp() {
  const cookieStore = cookies();
  const headersList = headers();

  // Create a mock request object
  const req = {
    headers: Object.fromEntries(headersList),
    cookies: Object.fromEntries(
      cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
    ),
    // getHeader(name: string) {
    //   return this.headers[name.toLowerCase()];
    // },
  } as unknown as NextApiRequest;

  // Mock response object with necessary methods
  const res = {
    getHeader: (name: string) => {
      // Implement logic if needed
    },
    setHeader: (name: string, value: string | string[]) => {
      // Implement logic to capture headers if needed
    },
  } as unknown as NextApiResponse;

  // Use getServerSession with mock req and res
  const session = await getServerSession(req, res, nextAuthOptions(req, res));
  return session;
}
