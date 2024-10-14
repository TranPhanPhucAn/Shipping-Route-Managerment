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
                      image_url
                    }
                    expAccessToken
                    permissionNames
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
            const permissionNames = data?.login?.permissionNames;

            console.log("user: ", response);
            return {
              ...user,
              expAccessToken: expAccessToken,
              permissionNames: permissionNames,
              loginMethod: "credentials",
            };
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
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, trigger, user, session }) {
        // console.log("get jwt: ", user);
        // console.log("get token jwt: ", token);

        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.username = user.username;
          token.address = user.address;
          token.expAccessToken = user.expAccessToken * 1000;
          token.avatar_url = user.image_url;
          token.permissionNames = user.permissionNames;
          token.loginMethod = user.loginMethod;
          // console.log("get token jwt: ", user);
        }
        if (trigger === "update" && session?.user) {
          // Note, that `session` can be any arbitrary object, remember to validate it!
          token.username = session.user.username;
          token.avatar_url = session.user.avatar_url;
        }
        return token;
      },

      async session({ token, session, trigger, newSession }) {
        // console.log("get toekn: ", token);
        // console.log("get session: ", session);

        if (token) {
          // console.log("islogin: ", token.isLogin);
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              username: token.username,
              address: token.address,
              avatar_url: token.avatar_url,
              permissionNames: token.permissionNames,
              loginMethod: token.loginMethod,
            },
          };
        }
        return session;
      },
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          const { id_token } = account;
          const { email } = user;
          try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URI!, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                mutation loginWithGoogle($loginInputGoogle: LoginInputGoogle!) {
                  loginWithGoogle(loginInputGoogle: $loginInputGoogle) {
                    user {
                      id
                      email
                      username
                      image_url
                    }
                    expAccessToken
                    permissionNames
                  }
                }
              `,
                variables: {
                  loginInputGoogle: {
                    email,
                    idToken: id_token,
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
              console.log("erros: ", errors);
              throw new Error(errors[0].message);
            }

            // const { data, errors } = response.parsedRes;

            const userBackend = data?.loginWithGoogle?.user;
            const expAccessToken = data?.loginWithGoogle?.expAccessToken;
            const permissionNames = data?.loginWithGoogle?.permissionNames;

            user.expAccessToken = expAccessToken;
            user.id = userBackend.id;
            user.username = userBackend.username;
            user.address = userBackend.address;
            user.image_url = userBackend.image_url;
            user.permissionNames = permissionNames;
            user.loginMethod = "google";

            return true;
          } catch (err: any) {
            throw new Error(err?.message || "Login failed");
            // throw new Error(err?.graphQLErrors[0]?.message);
          }
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
      // signOut: "/login",
      error: "/authError",
    },
  };
};

// export default NextAuth(authOptions);
export default (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
