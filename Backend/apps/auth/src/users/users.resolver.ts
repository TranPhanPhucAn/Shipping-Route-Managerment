import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  ActivationDto,
  CreateUserInput,
  UserRegister,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { RegisterResponse } from '../types/auth.types';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const { username, email, password, address } = createUserInput;
    const userRegister = new UserRegister();
    userRegister.username = username;
    userRegister.email = email;
    userRegister.password = password;
    userRegister.address = address;
    const errors = await validate(userRegister);
    if (errors.length > 0) {
      const errorsResponse: any = errors.map((val: any) => {
        return Object.values(val.constraints)[0] as string;
      });
      throw new BadRequestException(errorsResponse.join(','));
    }
    const token = await this.usersService.create(createUserInput);
    return { activation_token: token };
  }

  @Mutation(() => User)
  async activateUser(@Args('activationDto') activationDto: ActivationDto) {
    return await this.usersService.activateUser(activationDto);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  findOneByEmail(@Args('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.delete(id);
  }

  @Query(() => User, { name: 'forgotPassword' })
  forgotPassword(@Args('email') email: string) {
    return this.usersService.forgotPassword(email);
  }
}
