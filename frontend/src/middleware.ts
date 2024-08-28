import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const privatePaths = ["/about"];
const authPaths = ["/login", "/register"];
// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log("next auth request: ", req.nextauth.token);
//   if (privatePaths.some((path) => pathname.startsWith(path)) && !session) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   if (privatePaths.some((path) => pathname.startsWith(path)) && session) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
//   return NextResponse.next();
// }

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const { token } = request.nextauth;
    if (privatePaths.some((path) => pathname.startsWith(path)) && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (authPaths.some((path) => pathname.startsWith(path)) && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: [...privatePaths, ...authPaths],
};
