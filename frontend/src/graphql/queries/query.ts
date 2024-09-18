import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      email
      username
      address
    }
  }
`;

export const GET_ROUTES = gql`
  query {
    routes {
      id
      departurePort {
        id  
        name
      }
      destinationPort {
        id
        name
      }
      distance
      createdAt 
    }
  }
`;

export const GET_PORTS = gql`
  query GetPorts {
    ports {
      id
      name
    }
  }
`;
