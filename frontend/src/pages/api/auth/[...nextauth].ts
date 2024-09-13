import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";

// import fetch from "node-fetch";
type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

// export const authOptions: NextAuthOptions = {
export const nextAuthOptions: NextAuthOptionsCallback = (req, res) => {
  return {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        type: "credentials",
        credentials: {},
        async authorize(credentials, req): Promise<any> {
          console.log("get here");
          // Add logic here to look up the user from the credentials supplied
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URI!, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                mutation Login($loginInput: LoginInput!) {
                  login(loginInput: $loginInput) {
                    user {
                      id
                      email
                      username
                    }
                    expAccessToken
                  }
                }
              `,
                variables: {
                  loginInput: {
                    email,
                    password,
                  },
                },
              }),
              credentials: "include",
            });
            const cookiesList = response.headers.get("set-cookie");

            if (cookiesList) {
              // Correctly handle splitting multiple cookies, considering commas in Expires attributes
              const cookiesArray =
                cookiesList.match(
                  /(?<=^|,)([^,]*?Expires=.*?GMT);?(\s*HttpOnly)?(\s*Secure)?(\s*SameSite=None)?/g
                ) || [];
              res.setHeader("Set-Cookie", cookiesArray);
            }
            const { data, errors } = await response.json();
            // const { data } = response;

            if (errors) {
              throw new Error(errors[0].message);
            }

            // const { data, errors } = response.parsedRes;

            const user = data?.login?.user;
            const expAccessToken = data?.login?.expAccessToken;

            console.log("user: ", response);
            return { ...user, expAccessToken: expAccessToken };
          } catch (err: any) {
            throw new Error(err?.message || "Login failed");
            // throw new Error(err?.graphQLErrors[0]?.message);
          }
        },
      }),
      // GithubProvider({
      //   clientId: process.env.GITHUB_ID || "",
      //   clientSecret: process.env.GITHUB_SECRET || "",
      // }),
      // // ...add more providers here
      // GithubProvider({
      //   clientId: process.env.GOOGLE_ID || "",
      //   clientSecret: process.env.GOOGLE_SECRET || "",
      // }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        // console.log("get jwt: ", token);
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.username = user.username;
          token.address = user.address;
          token.expAccessToken = user.expAccessToken * 1000;
          token.isLogin = true;
        }
        return token;
      },

      async session({ token, user, session }) {
        // console.log("get session");

        if (token) {
          // console.log("islogin: ", token.isLogin);
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              username: token.username,
              address: token.address,
              isLogin: token.isLogin,
            },
          };
        }
        return session;
      },
    },
    pages: {
      signIn: "/login",
      // signOut: "/login",
    },
  };
};

// export default NextAuth(authOptions);
export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
