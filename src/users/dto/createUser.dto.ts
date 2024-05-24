import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        // tslint:disable-next-line: max-line-length
        { message: 'Password must be at least 8 characters long and include an uppercase and lowercase letter, and either a number or special character' },
    )
    password: string;
  
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsOptional()
    phone: string;

}