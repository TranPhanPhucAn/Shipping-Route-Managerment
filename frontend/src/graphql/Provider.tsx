"use client";
import React, { ReactNode } from "react";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SessionProvider } from "next-auth/react";
const link = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include", // tell your network interface to send the cookie along with every request.
});
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>{children} </SessionProvider>
    </ApolloProvider>
  );
};
export { client };
export default Provider;
