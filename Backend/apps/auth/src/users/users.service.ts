import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivationDto, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bycypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { GetUserResponse } from 'proto/user';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  PaginationUserDto,
  ResetPasswordDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const password = await this.hassPassword(createUserInput.password);
    createUserInput = { ...createUserInput, password: password };
    try {
      const existUser = await this.findOneByEmail(createUserInput.email);
      if (existUser) {
        throw new BadRequestException(`Email existed`);
      }
      const { token, activationCode } =
        await this.createActivationToken(createUserInput);
      await this.emailService.sendMail({
        email: createUserInput.email,
        subject: 'Activate your accout',
        name: createUserInput.username,
        activationCode: activationCode,
        template: './activation-mail',
      });
      return token;
    } catch (error) {
      console.log('error: ', error);
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
      throw new BadRequestException('Invalid activation code');
    }
    const userEntity = this.usersRepository.create();
    const createUser = {
      ...userEntity,
      ...newUser.user,
      refreshToken: '',
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

  async findOneById(id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findOneByIdService(userId: string): Promise<GetUserResponse> {
    const result = await this.findOneById(userId);
    const { id, username, email } = result;
    return {
      id: id,
      name: username,
      email: email,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) return user;
    return null;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    await this.usersRepository.update(id, updateUserInput);
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
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
  async forgotPassword(forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword;
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?verify=${forgotPasswordToken}`;
    await this.emailService.sendMail({
      email,
      subject: 'Reset your password',
      template: './forgot-password-mail',
      name: user.username,
      activationCode: resetPasswordUrl,
    });
    return { message: 'Your reset password request successfull!' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, forgotPasswordToken } = resetPasswordDto;
    const decoded = this.jwtService.verify(forgotPasswordToken, {
      secret: process.env.FORGOT_PASSWORD_SECRET,
    });
    if (!decoded) {
      throw new BadRequestException('Invalid token');
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
    const { limit, offset } = paginationUser;
    const skip = limit * offset;
    const [result, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: skip,
    });
    const totalCount = Math.ceil(total / limit);

    return {
      users: result,
      totalCount: totalCount,
    };
  }

  async changePassword(changePassword: ChangePasswordDto) {
    const { userId, oldPassword, newPassword } = changePassword;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    let isMatch: boolean = false;
    isMatch = bycypt.compare(oldPassword, user.password);
    if (isMatch) {
      const newPasswordHass = await this.hassPassword(newPassword);
      await this.usersRepository.update(userId, {
        password: newPasswordHass,
      });
      return { message: 'Change password succeed!' };
    } else {
      return { message: 'You enter wrong current password' };
    }
  }
}
