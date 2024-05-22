import { Role } from "@prisma/client";
import { IsEmail, isEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
 
    @IsString()
    @IsNotEmpty()
    role: Role;
}