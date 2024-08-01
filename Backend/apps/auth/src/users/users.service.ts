import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivationDto, CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { randomBytes } from 'crypto';
import * as bycypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';

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

  async forgotPassword(email): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    if (!user) false;

    const expiration = new Date(Date().valueOf() + 24 * 60 * 60 * 1000);
    const token = randomBytes(32).toString('hex');
    user.passwordReset = {
      token,
      expiration,
    };
    await this.usersRepository.save(user);
    return true;
  }
}
