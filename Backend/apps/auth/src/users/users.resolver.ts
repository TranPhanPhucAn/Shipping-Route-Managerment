import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ActivationDto, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { UseGuards } from '@nestjs/common';
import {
  ChangePasswordResponse,
  DeleteUserResponse,
  ForgotPasswordResponse,
  PaginationUserResponse,
  RegisterResponse,
  ResetPasswordResponse,
  UploadResponse,
} from '../types/auth.types';
// import { AuthUserGuard } from '../auth/guards/auth.guards';
import {
  AssignRoleDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  PaginationUserDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

import { FilesService } from '../files/files.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FilesService,
  ) {}

  @Mutation(() => RegisterResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const token = await this.usersService.create(createUserInput);
    return { activation_token: token };
  }

  @Mutation(() => User)
  async activateUser(@Args('activationDto') activationDto: ActivationDto) {
    return await this.usersService.activateUser(activationDto);
  }

  @SetMetadata('permissions', ['get:users'])
  @UseGuards(PermissionsGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => [User], { name: 'getSuppliers' })
  getSuppliers() {
    return this.usersService.getSuppliers();
  }

  @SetMetadata('permissions', ['get:user'])
  @UseGuards(PermissionsGuard)
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id') id: string) {
    console.log('user: ', await this.usersService.findOneById(id));
    return this.usersService.findOneById(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  findOneByEmail(@Args('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['update:user'])
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => DeleteUserResponse)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['delete:user'])
  removeUser(@Args('id') id: string) {
    return this.usersService.delete(id);
  }

  @Mutation(() => ForgotPasswordResponse, { name: 'forgotPassword' })
  forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse, { name: 'resetPassword' })
  resetPassword(@Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  // @UseGuards(AuthUserGuard)
  @Mutation(() => ChangePasswordResponse)
  changePassword(@Args('changePassword') changePassword: ChangePasswordDto) {
    return this.usersService.changePassword(changePassword);
  }

  @SetMetadata('permissions', ['get:usersPag'])
  @UseGuards(PermissionsGuard)
  @Query(() => PaginationUserResponse, { name: 'paginationUser' })
  paginationUser(@Args('paginationUser') paginationUser: PaginationUserDto) {
    return this.usersService.paginationUser(paginationUser);
  }

  @SetMetadata('permissions', ['assignRole:user'])
  @UseGuards(PermissionsGuard)
  @Mutation(() => User)
  assignRoleForUser(@Args('assignRoleDto') assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRoleForUser(assignRoleDto);
  }

  @ResolveReference()
  resolveReferRoute(ref: { __typename: string; id: string }) {
    return this.usersService.findOneById(ref.id);
  }

  @Mutation(() => UploadResponse, { name: 'uploadImage' })
  async uploadImage(
    @Args('file', { type: () => GraphQLUpload }) file: Upload,
    @Args('id') id: string,
  ) {
    // const check = await file;

    // const fileData = await file;

    // Log the entire file data to inspect it

    const containerName = 'fileupload';
    const upload = await this.fileService.uploadFile(file.file, containerName);
    this.usersService.saveUrl(id, upload, containerName);
    return {
      message: 'Upload image successfull',
      img_url: upload,
    };
  }
}
