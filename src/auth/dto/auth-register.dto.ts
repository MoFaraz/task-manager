import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class AuthRegisterDto{
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    // tslint:disable-next-line: max-line-length
    { message: 'Password must be at least 8 characters long and include an uppercase and lowercase letter, and either a number or special character' },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}