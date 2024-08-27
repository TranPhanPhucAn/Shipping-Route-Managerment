import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/src/graphql/Provider";
import { LOGIN_USER } from "@/src/graphql/mutations/Auth";
// import { useMutation } from "@apollo/client";
// import { LOGIN_USER } from "../../../graphql/mutations/Auth";
// import { LoginInput } from "@/src/graphql/types";

// const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      // name: "Credentials",
      type: "credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        // email: {},
        // password: {},
      },
      async authorize(credentials, req): Promise<any> {
        // Add logic here to look up the user from the credentials supplied
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // const response = await loginUser({
        //   variables: {
        //     loginInput: {
        //       email,
        //       password,
        //     } as LoginInput,
        //   },
        // });
        console.log("nextauth: ", credentials);
        try {
          const response = await client.mutate({
            mutation: LOGIN_USER,
            variables: {
              loginInput: {
                email,
                password,
              },
            },
          });
          console.log("response graphql here: ", response);
        } catch (err: any) {
          throw new Error(err?.graphQLErrors[0]?.message);
        }
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
