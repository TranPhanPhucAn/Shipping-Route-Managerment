import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        email
        username
        address
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout {
      message
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

export const ACTIVATE_ACCOUNT = gql`
  mutation ActivateUser($activationDto: ActivationDto!) {
    activateUser(activationDto: $activationDto) {
      id
      email
      username
      address
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation {
    refreshToken {
      message
    }
  }
`;
