import { InputType, Field } from '@nestjs/graphql';
import { IsDefined, IsString } from 'class-validator';

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
  @IsString()
  public email: string;

  @IsDefined()
  @IsString()
  public password: string;

  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsString()
  public address: string;
}
