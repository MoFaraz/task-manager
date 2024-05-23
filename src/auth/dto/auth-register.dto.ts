import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto{
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}