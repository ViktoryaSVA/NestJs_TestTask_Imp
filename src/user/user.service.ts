import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { BlackListEntity } from '@app/user/blackList/black-list.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlackListEntity)
    private readonly blackListRepository: Repository<BlackListEntity>,

  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'username', 'password', 'email', 'bio', 'image'],
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async logoutUser(token: string): Promise<void> {
    const blacklistRecord = this.blackListRepository.create({ token });
    await this.blackListRepository.save(blacklistRecord);
  }

  async checkTokenBlacklist(token: string): Promise<boolean> {
    const blacklistRecord = await this.blackListRepository.findOne({ where: { token } });
    return !!blacklistRecord;
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }
  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
