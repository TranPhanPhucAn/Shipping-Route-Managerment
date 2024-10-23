import { Inject, Injectable } from '@nestjs/common';
import { ActivationDto, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bycypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { GetUserResponse } from 'proto/user';
import {
  AssignRoleDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  PaginationUserDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { GraphQLError } from 'graphql';
import { Role } from '../roles/entities/role.entity';
import { GetUserResponse } from '../proto/user';
import { ClientKafka } from '@nestjs/microservices';
import { UserActivateEvent } from './events/user-activate.event';
import { ForgotPasswordEvent } from './events/forgot-password.event';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
    private readonly fileService: FilesService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const password = await this.hassPassword(createUserInput.password);
    createUserInput = { ...createUserInput, password: password };
    try {
      const existUser = await this.findOneByEmail(createUserInput.email);
      if (existUser) {
        throw new GraphQLError('Email already exists', {
          extensions: {
            errorCode: '5001-5',
          },
        });
      }
      const { token, activationCode } =
        await this.createActivationToken(createUserInput);
      this.notificationClient.emit(
        'user_activation',
        new UserActivateEvent(
          createUserInput.email,
          'Activate your accout',
          createUserInput.username,
          activationCode,
        ),
      );
      return token;
    } catch (error) {
      throw error;
    }
  }

  async createActivationToken(user: CreateUserInput) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: process.env.ACTIVATION_SECRET,
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  async activateUser(activationDto: ActivationDto) {
    const { activationToken, activationCode } = activationDto;
    const newUser: { user: CreateUserInput; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: process.env.ACTIVATION_SECRET,
      });
    if (newUser.activationCode !== activationCode) {
      throw new GraphQLError('Invalid activation code', {
        extensions: {
          errorCode: '5001-6',
        },
      });
    }
    const roleRegister = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    const userEntity = this.usersRepository.create();
    const createUser = {
      ...userEntity,
      ...newUser.user,
      refreshToken: '',
      role: roleRegister,
    };
    const user: User | undefined = await this.usersRepository.save(createUser);
    return user;
  }
  private async hassPassword(password: string) {
    return bycypt.hash(password, 10);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getSuppliers(): Promise<User[]> {
    return await this.usersRepository.find({
      where: {
        role: {
          id: '2',
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id: id },
      relations: { role: true },
    });
  }

  async findOneByIdService(userId: string): Promise<GetUserResponse> {
    const resultUser = await this.findOneById(userId);
    const { id, username, email, role } = resultUser;
    const resultPermissions = await this.rolesRepository.findOne({
      where: { id: role.id },
      relations: { permissions: true },
    });
    const permissions = resultPermissions.permissions.map(
      (perm) => perm.permission,
    );
    return {
      id: id,
      name: username,
      email: email,
      permissions: permissions,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: { role: true },
    });
    if (user) return user;
    return null;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    await this.usersRepository.update(id, updateUserInput);
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async delete(id: string) {
    const user = this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      return {
        message: 'User is not exist',
      };
    }
    await this.usersRepository.delete(id);
    return {
      message: 'Delete user succeed',
    };
  }

  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: process.env.FORGOT_PASSWORD_SECRET,
        expiresIn: process.env.EXPIRES_IN_FORGOT_PASS,
      },
    );
    return forgotPasswordToken;
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new GraphQLError('User not found with this email!', {
        extensions: {
          errorCode: '5001-7',
        },
      });
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?verify=${forgotPasswordToken}`;
    this.notificationClient.emit(
      'forgot_password',
      new ForgotPasswordEvent(
        email,
        'Reset password',
        user.username,
        resetPasswordUrl,
      ),
    );
    return { message: 'Check your email to reset password' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, forgotPasswordToken } = resetPasswordDto;
    const decoded = this.jwtService.verify(forgotPasswordToken, {
      secret: process.env.FORGOT_PASSWORD_SECRET,
      ignoreExpiration: true,
    });
    const expirationTime = decoded?.exp;
    if (expirationTime * 1000 < Date.now()) {
      throw new GraphQLError('Link reset password expired', {
        extensions: {
          errorCode: '5001-11',
        },
      });
    }
    if (!decoded) {
      throw new GraphQLError('Invalid token', {
        extensions: {
          errorCode: '5001-8',
        },
      });
    }
    const hassPassword = await this.hassPassword(password);
    const user = await this.findOneById(decoded.user.id);
    if (user) {
      await this.usersRepository.update(decoded.user.id, {
        password: hassPassword,
      });
      return { message: 'Reset password successfull!' };
    }
  }

  async paginationUser(paginationUser: PaginationUserDto) {
    const { limit, offset, sort, genderFilter, roleFilter, search } =
      paginationUser;
    const skip = limit * offset;
    const order: Record<string, 'ASC' | 'DESC'> = {};

    if (sort) {
      sort.split(',').forEach((sortParam: string) => {
        const [field, direction] = sortParam.split(' ');
        order[field] = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      });
    }
    order['id'] = 'DESC';

    const genderArray = genderFilter?.split(',');
    const roleArray = roleFilter?.split(',');

    const queryOptions: any = {
      take: limit,
      skip: skip,
      relations: { role: true },
      order,
    };
    const whereCondition: any = {};
    if (genderArray) {
      whereCondition.gender = In(genderArray);
    }
    if (roleArray) {
      whereCondition.role = {
        name: In(roleArray),
      };
    }
    if (search) {
      whereCondition.username = ILike(`%${search}%`);
    }
    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }
    const [result, total] =
      await this.usersRepository.findAndCount(queryOptions);
    // const totalCount = Math.ceil(total / limit);
    const totalCount = total;

    return {
      users: result,
      totalCount: totalCount,
    };
  }

  async changePassword(changePassword: ChangePasswordDto) {
    const { userId, oldPassword, newPassword } = changePassword;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    let isMatch: boolean = false;
    isMatch = await bycypt.compare(oldPassword, user.password);
    if (isMatch) {
      const newPasswordHass = await this.hassPassword(newPassword);
      await this.usersRepository.update(userId, {
        password: newPasswordHass,
      });
      return { message: 'Change password succeed!' };
    } else {
      throw new GraphQLError('Your recent password not correct', {
        extensions: {
          errorCode: '5001-17',
        },
      });
    }
  }

  async assignRoleForUser(assignRoleDto: AssignRoleDto) {
    const user = await this.usersRepository.findOne({
      where: { id: assignRoleDto.userId },
    });
    const role = await this.rolesRepository.findOne({
      where: { id: assignRoleDto.roleId },
    });
    user.role = role;
    await this.usersRepository.save(user);
    return user;
  }
  async saveUrl(id, file_url: string, containerName: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    const file_image = user?.image_url;
    let getfile = '';

    if (file_image) {
      getfile = file_image.split('/').pop();
    }
    await this.usersRepository.save({
      ...user,
      image_url: file_url,
    });
    await this.fileService.deleteFile(getfile, containerName);
  }

  async remove(id: string, containerName: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });
      const file_url = user?.image_url;
      if (file_url) {
        await this.usersRepository.update(id, {
          ...user,
          image_url: '',
        });

        const file_ = file_url.split('/').pop();

        await this.fileService.deleteFile(file_, containerName);
      }

      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
