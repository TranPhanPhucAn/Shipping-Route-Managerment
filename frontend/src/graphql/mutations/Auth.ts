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

export const CHANGE_PASSWORD = gql`
  mutation changePassword($changePassword: ChangePasswordDto!) {
    changePassword(changePassword: $changePassword) {
      message
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

export const CREATE_ROLE = gql`
  mutation createRole($createRoleInput: CreateRoleInput!) {
    createRole(createRoleInput: $createRoleInput) {
      name
      description
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {
    updateRole(updateRoleInput: $updateRoleInput) {
      id
      name
      description
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation removeRole($id: String!) {
    removeRole(id: $id) {
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

export const ASSIGN_PER_FOR_ROLE = gql`
  mutation assignPerForRole($assignPermissionDto: AssignPermissionDto!) {
    assignPerForRole(assignPermissionDto: $assignPermissionDto) {
      id
      name
    }
  }
`;

export const UPDATE_PERMISSION = gql`
  mutation UpdatePermission($updatePermissionInput: UpdatePermissionInput!) {
    updatePermission(updatePermissionInput: $updatePermissionInput) {
      id
      permission
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

export const RESET_PASSWORD = gql`
  mutation resetPassword($resetPasswordDto: ResetPasswordDto!) {
    resetPassword(resetPasswordDto: $resetPasswordDto) {
      message
    }
  }
`;

//Port
export const CREATE_PORT = gql`
  mutation createPort($createPortInput: CreatePortInput!) {
    createPort(createPortInput: $createPortInput) {
      id
      name
      latitude
      longitude
      country
    }
  }
`;

export const UPDATE_PORT = gql`
  mutation updatePort($id: String!, $updatePortInput: UpdatePortInput!) {
    updatePort(id: $id, updatePortInput: $updatePortInput) {
      id
      name
      latitude
      longitude
      country
    }
  }
`;
export const DELETE_PORT = gql`
  mutation removePort($id: String!) {
    removePort(id: $id)
  }
`;

// Route
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
      estimatedTimeDays
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
      estimatedTimeDays
    }
  }
`;
export const DELETE_ROUTE = gql`
  mutation removeRoute($id: String!) {
    removeRoute(id: $id)
  }
`;

// Schedule
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

//Vessel

export const CREATE_VESSEL = gql`
  mutation createVessel($createVesselInput: CreateVesselInput!) {
    createVessel(createVesselInput: $createVesselInput) {
      id
      name
      type
      capacity
      ownerId
      status
    }
  }
`;

export const UPDATE_VESSEL = gql`
  mutation updateVessel($id: String!, $updateVesselInput: UpdateVesselInput!) {
    updateVessel(id: $id, updateVesselInput: $updateVesselInput) {
      id
      name
      type
      capacity
      ownerId
      status
    }
  }
`;
export const DELETE_VESSEL = gql`
  mutation removeVessel($id: String!) {
    removeVessel(id: $id)
  }
`;
