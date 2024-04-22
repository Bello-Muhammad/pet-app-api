import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schema/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseType } from './userResponse/userResponse.type';
import { LoginUserDto } from './dto/login-user.dts';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findByCridential(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async loginUser(loginDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      username: loginDto.username
    });

    if (!user) {
      throw new HttpException(
        'invalid username',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'invalid password',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return user;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const userExist = await this.userRepository.findOne({
      username: createUserDto.username
    });

    if (userExist) {
      throw new HttpException('user exist', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const createdUser = await this.userRepository.create({
      username: createUserDto.username,
      role: createUserDto.role,
      password: createUserDto.password
    });

    return {
      username: createdUser.username,
      role: createdUser.role
    };
  }

  async updateUser(
    username: string,
    userUpdates: UpdateUserDto
  ): Promise<User> {
    const checkForUser = await this.userRepository.findOne({ username });

    if (!checkForUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.findOneAndUpdate({ username }, userUpdates);
  }

  async deleteUser(userId: string): Promise<User> {
    return this.userRepository.findOneAndDelete({ _id: userId });
  }

  buildUserResponse(user: User): UserResponseType {
    return {
      username: user.username,
      role: user.role,
      token: this.generateJwt(user)
    };
  }

  generateJwt(user: User): string {
    return sign({ username: user.username }, 'jwtusageonly');
  }
}
