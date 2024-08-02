import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      activation_token
    }
  }
`;
