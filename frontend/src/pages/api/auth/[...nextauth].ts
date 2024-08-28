import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/src/graphql/Provider";
import { LOGIN_USER } from "@/src/graphql/mutations/Auth";
import { NextApiRequest, NextApiResponse } from "next";

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

// export const authOptions: NextAuthOptions = {
const nextAuthOptions: NextAuthOptionsCallback = (req, res) => {
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
            const cookies = response.headers.get("set-cookie");
            if (cookies) {
              // Correctly handle splitting multiple cookies, considering commas in Expires attributes
              const cookiesArray =
                cookies.match(
                  /(?<=^|,)([^,]*?Expires=.*?GMT);?(\s*HttpOnly)?(\s*Secure)?(\s*SameSite=None)?/g
                ) || [];
              res.setHeader("Set-Cookie", cookiesArray);
            }
            // console.log(response);
            const { data, errors } = await response.json();
            // const { data } = response;
            if (errors) {
              throw new Error(errors[0].message);
            }

            const user = data?.login?.user;
            console.log("user: ", response);
            return user;
          } catch (err: any) {
            // console.log("???");
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
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.username = user.username;
          token.address = user.address;
        }
        return token;
      },
      async session({ token, user, session }) {
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
    },
  };
};

// export default NextAuth(authOptions);
export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
