import { InputType, Field } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  // @Field()
  // id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  address: string;
}

export class UserRegister {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsDefined()
  @IsString()
  public address: string;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'Activation token is required' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation code is required' })
  activationCode: string;
}
