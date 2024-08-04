import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Forgot password token is required' })
  forgotPasswordToken: string;
}

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  oldPassword: string;

  @Field()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
