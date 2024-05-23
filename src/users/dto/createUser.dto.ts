import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
  
    @IsString()
    @IsNotEmpty()
    role: string;
}