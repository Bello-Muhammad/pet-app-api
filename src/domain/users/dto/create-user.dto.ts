import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'please provide username' })
  @IsString({ message: 'username must be string' })
  username: string;

  @IsNotEmpty({ message: 'please provide user role' })
  @IsString({ message: 'user role must be string' })
  role: string;

  @IsNotEmpty({ message: 'please provide user first name' })
  @IsString({ message: 'user first name must be string' })
  password: string;
}
