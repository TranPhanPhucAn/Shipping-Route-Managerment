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
export interface RegisterResponse {
  activation_token: string;
}
export interface ActivationDto {
  activationCode: string;
  activationToken: string;
}

export interface Port {
  name: string;
}

export interface Route {
  id: string;
  departurePort: Port;
  destinationPort: Port;
  distance: number;
  createdAt: string;
}

export interface GetRoutesData {
  routes: Route[];
}
