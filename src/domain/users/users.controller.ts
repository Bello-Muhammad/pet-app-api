import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseType } from './userResponse/userResponse.type';
import { LoginUserDto } from './dto/login-user.dts';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseHandler } from '../responseHandler/petResponse.handler';

@Controller('auth/')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseType> {
    try {
      const user = await this.userService.loginUser(loginUserDto);
      const logedInUser = await this.userService.buildUserResponse(user);

      return ApiResponseHandler.successResponse(200, 'user login', logedInUser);
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
    const user = await this.userService.loginUser(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseType> {
    try {
      const newUser = await this.userService.registerUser(createUserDto);
      const userRes = await this.userService.buildUserResponse(newUser);

      return ApiResponseHandler.successResponse(
        201,
        'user created successfully',
        userRes
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Patch('change-password')
  async changeUserPassword(
    @Request() req: Request | any,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseType> {
    const { username } = req.user;
    try {
      const modifiedUser = await this.userService.updateUser(
        username,
        updateUserDto
      );

      return ApiResponseHandler.successResponse(
        200,
        'password changed successfully',
        modifiedUser
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }
}
