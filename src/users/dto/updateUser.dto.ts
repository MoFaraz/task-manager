import { Role } from "@prisma/client";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    role?: Role;
}