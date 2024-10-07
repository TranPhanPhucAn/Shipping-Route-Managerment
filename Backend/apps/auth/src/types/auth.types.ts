import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class LoginResponseService {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  expAccessToken?: number;

  @Field(() => [String])
  permissionNames: string[];
}
@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  expAccessToken?: number;

  @Field(() => [String])
  permissionNames: string[];
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RefreshTokenResponseService {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  message: string;

  @Field()
  expAccessToken: number;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field()
  message?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field()
  message?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class PaginationUserResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field()
  totalCount?: number;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class DeleteUserResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class DeletePermissionResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class DeleteRoleResponse {
  @Field()
  message?: string;
}

@ObjectType()
export class UploadResponse {
  @Field()
  message?: string;

  @Field()
  img_url?: string;
}
