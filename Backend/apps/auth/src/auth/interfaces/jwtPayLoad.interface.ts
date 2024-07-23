export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  // permission:string[]
  expiration?: Date;
}
