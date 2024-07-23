import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsDefined, IsString } from 'class-validator';
@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class UserAuth {
  @IsDefined()
  @IsString()
  public email: string;

  @IsDefined()
  @IsString()
  public password: string;
}
