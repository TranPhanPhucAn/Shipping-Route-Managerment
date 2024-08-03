"use client";
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
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
