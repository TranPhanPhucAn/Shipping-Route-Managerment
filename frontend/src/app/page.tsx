import React from "react";
import Header from "../components/layout/Header";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/gql-setup";

const HomePage: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Header />
      <h1>Welcome to the Shipping Route Management System</h1>
    </ApolloProvider>
  );
};

export default HomePage;
