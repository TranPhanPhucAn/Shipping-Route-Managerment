import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ActivationDto, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from '../types/auth.types';
import { AuthUserGuard } from '../auth/guards/auth.guards';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const token = await this.usersService.create(createUserInput);
    return { activation_token: token };
  }

  @Mutation(() => User)
  async activateUser(@Args('activationDto') activationDto: ActivationDto) {
    return await this.usersService.activateUser(activationDto);
  }

  @UseGuards(AuthUserGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthUserGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(AuthUserGuard)
  @Query(() => User, { name: 'userByEmail' })
  findOneByEmail(@Args('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(AuthUserGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(AuthUserGuard)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.delete(id);
  }

  @Query(() => ForgotPasswordResponse, { name: 'forgotPassword' })
  forgotPassword(@Args('forgotPassword') forgotPassword: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPassword);
  }

  @Query(() => ResetPasswordResponse, { name: 'resetPassword' })
  resetPassword(@Args('resetPassword') resetPassword: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPassword);
  }

  @Mutation(() => ChangePasswordResponse)
  changePassword(@Args('changePassword') changePassword: ChangePasswordDto) {
    return this.usersService.changePassword(changePassword);
  }

  @ResolveReference()
  async resolveReferRoute(ref: { __typename: string; id: string }) {
    return this.usersService.findOneById(ref.id);
  }
}
