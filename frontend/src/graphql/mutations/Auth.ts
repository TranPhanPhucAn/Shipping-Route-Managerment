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

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      username
    }
  }
`;

export const DELETE_USER = gql`
  mutation removeUser($id: String!) {
    removeUser(id: $id) {
      message
    }
  }
`;

export const ASSIGN_ROLE_FOR_USER = gql`
  mutation assignRoleForUser($assignRoleDto: AssignRoleDto!) {
    assignRoleForUser(assignRoleDto: $assignRoleDto) {
      id
      email
      username
      role {
        id
        name
      }
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation UploadImage($file: Upload!, $id: String!) {
    uploadImage(file: $file, id: $id) {
      message
      img_url
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

export const CREATE_ROUTE = gql`
  mutation createRoute($createRouteInput: CreateRouteInput!) {
    createRoute(createRouteInput: $createRouteInput) {
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
export const UPDATE_ROUTE = gql`
  mutation UpdateRoute($id: String!, $updateRouteInput: UpdateRouteInput!) {
    updateRoute(id: $id, updateRouteInput: $updateRouteInput) {
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
    }
  }
`;
export const DELETE_ROUTE = gql`
  mutation removeRoute($id: String!) {
    removeRoute(id: $id)
  }
`;

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($createScheduleInput: CreateScheduleInput!) {
    createSchedule(createScheduleInput: $createScheduleInput) {
      id
      vessel {
        id
        name
      }
      route {
        id
        departurePort {
          id
          name
        }
        destinationPort {
          id
          name
        }
      }
      departure_time
      arrival_time
      status
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule(
    $id: String!
    $updateScheduleInput: UpdateScheduleInput!
  ) {
    updateSchedule(id: $id, updateScheduleInput: $updateScheduleInput) {
      id
      vessel {
        id
        name
      }
      route {
        id
        departurePort {
          name
        }
        destinationPort {
          name
        }
      }
      departure_time
      arrival_time
      status
    }
  }
`;
export const DELETE_SCHEDULE = gql`
  mutation removeSchedule($id: String!) {
    removeSchedule(id: $id)
  }
`;
