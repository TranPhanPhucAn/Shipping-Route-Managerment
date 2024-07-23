import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { randomBytes } from 'crypto';
import * as bycypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const userEntity = this.usersRepository.create();
    const password = await this.hassPassword(createUserInput.password);
    const newUser = {
      ...userEntity,
      ...createUserInput,
      password: password,
    };
    let user: User | undefined;
    try {
      const existUser = await this.findOneByEmail(createUserInput.email);
      if (existUser) {
        throw new BadRequestException(`Email existed`);
      }
      user = await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('error: ', error);
    }
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
    user.updated_at = new Date();
    await this.usersRepository.save(user);
    return true;
  }
}
