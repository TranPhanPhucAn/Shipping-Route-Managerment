import { encode, getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = [
  "/profile",
  "/routes",
  "/schedules",
  "/users",
  "/roles",
  "/maps",
  "/routes",
  "/schedules",
  "/vessels",
  "/ports",
];

const authPaths = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  if (token) {
    if (token.expAccessToken - Date.now() < 60 * 1000) {
      const accessToken = request.cookies.get("access_token")?.value || "";
      const refreshToken = request.cookies.get("refresh_token")?.value || "";
      if (!accessToken) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.set("refresh_token", "", {
          maxAge: 0,
          path: "/",
          httpOnly: true,
        });
        res.cookies.set("next-auth.session-token", "", {
          maxAge: 0,
          path: "/",
          httpOnly: true,
        });
        return res;
      }

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URI!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
          },
          credentials: "include",
          body: JSON.stringify({
            query: `
                  mutation refreshToken{
                    refreshToken {
                      message
                      expAccessToken
                    }
                  }
                `,
          }),
        });
        const { data, errors } = await response.json();
        const expAccessToken = data?.refreshToken?.expAccessToken;

        if (errors) {
          console.log("errors:", errors[0]);
          const res = NextResponse.redirect(new URL("/login", request.url));

          res.cookies.set("access_token", "", {
            maxAge: 0,
            path: "/",
            httpOnly: true,
          });

          res.cookies.set("refresh_token", "", {
            maxAge: 0,
            path: "/",
            httpOnly: true,
          });
          res.cookies.set("next-auth.session-token", "", {
            maxAge: 0,
            path: "/",
            httpOnly: true,
          });
          return res;
        }
        const res = NextResponse.redirect(request.url);
        const cookiesList = response.headers.get("set-cookie");
        if (cookiesList) {
          // Correctly handle splitting multiple cookies, considering commas in Expires attributes
          const cookiesArray =
            cookiesList.match(
              /(?<=^|,)([^,]*?Expires=.*?GMT);?(\s*HttpOnly)?(\s*Secure)?(\s*SameSite=None)?/g
            ) || [];
          console.log("cookieArray: ", cookiesArray);
          cookiesArray.forEach((cookie) => {
            const [nameValuePair, ...cookieAttributes] = cookie.split("; ");
            const [name, value] = nameValuePair.split("=");
            let valueSetCooki = decodeURIComponent(value);
            const expiresAttribute = cookieAttributes.find((attr) =>
              attr.startsWith("Expires=")
            );
            let expires;
            if (expiresAttribute) {
              expires = new Date(expiresAttribute.split("=")[1]);
            }
            res.cookies.set(name, valueSetCooki, {
              httpOnly: cookieAttributes.includes("HttpOnly"),
              secure: cookieAttributes.includes("Secure"),
              sameSite: cookieAttributes.includes("SameSite=None")
                ? "none"
                : undefined,
              expires: expires ? expires : undefined,
            });
          });
          token.expAccessToken = expAccessToken * 1000;
          const newEncodedToken = await encode({
            token: token,
            secret: process.env.NEXTAUTH_SECRET!,
          });

          res.cookies.set("next-auth.session-token", newEncodedToken, {
            httpOnly: true,
            secure: true,
          });
          return res;
        }
      } catch (e: any) {
        console.log("error: ", e);
      }
    }
    if (pathname === "/users") {
      if (!token.permissionNames.includes("get:usersPag")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    if (pathname === "/roles") {
      if (!token.permissionNames.includes("get:roles")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    if (pathname === "/vessels") {
      if (!token.permissionNames.includes("get:vessels")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    if (pathname === "/ports") {
      if (!token.permissionNames.includes("get:portsPag")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    if (pathname === "/routes") {
      if (!token.permissionNames.includes("get:routesPag")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
  if (!token && privatePaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Redirect to home if trying to access auth paths with a token
  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    // if (pathname === "/login") {
    //   console.log("get middleware err");
    //   return NextResponse.next();
    // }
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ["/about/:path*", "/login", "/register"],
  matcher: "/:path*",
};
