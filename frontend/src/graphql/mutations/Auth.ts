import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      activation_token
      error {
        message
        code
      }
    }
  }
`;
