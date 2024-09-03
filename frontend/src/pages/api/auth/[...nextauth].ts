import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/src/graphql/Provider";
import { LOGIN_USER, REFRESH_TOKEN } from "@/src/graphql/mutations/Auth";
import { NextApiRequest, NextApiResponse } from "next";

import { cookies } from "next/headers";
import loginfetch from "@/src/app/(auth)/login/login";

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
            // const response = await client.mutate({
            //   mutation: LOGIN_USER,
            //   variables: {
            //     loginInput: {
            //       email,
            //       password,
            //     },
            //   },
            //   context: {
            //     fetchOptions: {
            //       credentials: "include",
            //     },
            //   },
            // });

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

            // const response = await loginfetch(email, password);
            // if (!response.cookiesList) {
            //   throw new Error(response.parsedRes.errors[0].message);
            // }
            // const cookiesList = response.cookiesList;

            if (cookiesList) {
              // Correctly handle splitting multiple cookies, considering commas in Expires attributes
              const cookiesArray =
                cookiesList.match(
                  /(?<=^|,)([^,]*?Expires=.*?GMT);?(\s*HttpOnly)?(\s*Secure)?(\s*SameSite=None)?/g
                ) || [];
              res.setHeader("Set-Cookie", cookiesArray);
              // const accessToken = cookiesList.split(";")[0].split("=")[1];
              // console.log("accesstoken: ", accessToken);
              // cookies().set({
              //   name: "access_token",
              //   value: accessToken,
              //   secure: true,
              //   httpOnly: true,
              //   expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
              // });
              // res.setHeader("Set-Cookie", [
              //   `access_token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=None; Expires=${new Date(
              //     Date.now() + 1 * 60 * 60 * 1000
              //   ).toUTCString()}`,
              // ]);
              console.log("abcxyz");
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
        console.log("get jwt: ", token);
        // const cookieStore = cookies();
        // const acceess = cookieStore.get("access_token");
        // console.log("cookies store: ", cookieStore);
        // console.log("access token: ", acceess);

        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.username = user.username;
          token.address = user.address;
          token.expAccessToken = user.expAccessToken * 1000;
        }
        console.log("Date: ", Date.now());
        if (token.expAccessToken - Date.now() < 30 * 1000) {
          const accessToken = req?.cookies["access_token"];
          const refreshToken = req?.cookies["refresh_token"];

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
                    }
                  }
                `,
              }),
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
          } catch (e: any) {
            // console.log("error 1: ", e.networkError.result);
            console.log("error: ", e);
          }
        }
        return token;
      },

      async session({ token, user, session }) {
        // console.log("get session");

        if (token) {
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              username: token.username,
              address: token.address,
            },
          };
        }
        return session;
      },
    },
    pages: {
      signIn: "/login",
      signOut: "/",
    },
  };
};

// export default NextAuth(authOptions);
export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
