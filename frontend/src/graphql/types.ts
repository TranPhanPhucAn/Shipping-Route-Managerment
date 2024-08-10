//Login
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Register
export interface createUserInput {
  email: string;
  username: string;
  password: string;
  address: string;
}
export interface RegisterResponse {
  activation_token: string;
}

//activate user account
export interface ActivationDto {
  activationCode: string;
  activationToken: string;
}

//forgot password
export interface ForgotPasswordDto {
  email: string;
}
