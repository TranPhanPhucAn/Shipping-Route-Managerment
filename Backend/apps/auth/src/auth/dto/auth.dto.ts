import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

@InputType()
export class LoginInputGoogle {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  idToken: string;
}
