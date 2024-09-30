"use client";
import React, { ReactNode } from "react";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";
const link = createHttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include", // tell your network interface to send the cookie along with every request.
});
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
// const link = createUploadLink({
//   uri: process.env.NEXT_PUBLIC_SERVER_URI,
//   credentials: "include", // tell your network interface to send the cookie along with every request.
//   headers: {
//     "Apollo-Require-Preflight": "true", // Add the custom header here
//   },
// });
// const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache(),
// });
const Provider = ({ children }: { children: ReactNode }) => {
  // const link = createHttpLink({
  //   uri: process.env.NEXT_PUBLIC_SERVER_URI,
  //   credentials: "include", // tell your network interface to send the cookie along with every request.
  // });
  // const client = new ApolloClient({
  //   link,
  //   cache: new InMemoryCache(),
  // });

  return (
    <ApolloProvider client={client}>
      <SessionProvider>{children} </SessionProvider>
    </ApolloProvider>
  );
};
export { client };
export default Provider;

// const link2 = createUploadLink({
//   uri: "http://localhost:5001/graphql",
//   credentials: "include", // tell your network interface to send the cookie along with every request.
//   headers: {
//     "Apollo-Require-Preflight": "true", // Add the custom header here
//   },
// });
// export const client2 = new ApolloClient({
//   link: link2,
//   cache: new InMemoryCache(),
// });
