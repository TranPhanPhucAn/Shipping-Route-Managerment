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

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($forgotPasswordDto: ForgotPasswordDto!) {
    forgotPassword(forgotPasswordDto: $forgotPasswordDto) {
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($resetPasswordDto: ResetPasswordDto!) {
    resetPassword(resetPasswordDto: $resetPasswordDto) {
      message
    }
  }
`;
