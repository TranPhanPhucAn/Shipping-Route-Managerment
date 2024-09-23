export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginInputGoogle {
  email: string;
  idToken: string;
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

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password: string;
  forgotPasswordToken: string;
}
export interface Port {
  id: string;
  name: string;
  location: string;
  departureRoutes: Route;
  destinationRoutes: Route;
  createdAt: string;
  updatedAt: string;
}
export interface GetPortsData {
  ports: Port[];
}

export interface Route {
  id: string;
  departurePort: Port;
  destinationPort: Port;
  distance: number;
  createdAt: string;
  UpdatedAt: string;
}

export interface GetRoutesData {
  routes: Route[];
}
export interface createRouteInput {
  departurePortId: string;
  destinationPortId: string;
  distance: number;
}

export interface UpdateRouteInput {
  departurePortId: string;
  destinationPortId: string;
  distance: number;
}

export interface CreateScheduleInput {
  vesselId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
}

export interface Vessel {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
}
export interface GetVesselsData {
  vessels: Vessel[];
}
export interface Schedule {
  id: string;
  vessel: Vessel;
  route: Route;
  departure_time: string;
  arrival_time: string;
  status: string;
}
export interface GetSchedulesData {
  schedules: Schedule[];
}
