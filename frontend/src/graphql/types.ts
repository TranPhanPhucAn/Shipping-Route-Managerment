import Register from "../app/register/page";
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface createUserInput {
  email: string;
  username: string;
  password: string;
  address: string;
}
export interface ActivationDto {
  email: string;
  activationCode: string;
}

export interface ActivationResponse {
  id: string;
  email: string;
  isActive: boolean;
}
