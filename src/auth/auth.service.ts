import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { OmitUser } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, configService: ConfigService, private prisma: PrismaService){}

    async register(authRegisterDto: AuthRegisterDto): Promise<OmitUser> | never {
        const existUserByEmail = await this.prisma.user.findUnique({
            where: {
                email: authRegisterDto.email,
            },
        });

        if (existUserByEmail) {
            throw new ConflictException('Conflict', {
                cause: new Error(),
                description: 'User already exist',
            });
        }

        const saltOrRounds = 10;
        const password = authRegisterDto.password;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        const user = await this.prisma.user.create({
            data: {
                username: authRegisterDto.username,
                email: authRegisterDto.email,
                password: hashedPassword,
            },
        });

        delete user.password;

        return user;
    }
    
    async login(authLoginDto: AuthLoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: authLoginDto.username,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Credentials incorrect');
        }

        const isPasswordMatch = await bcrypt.compare(
            authLoginDto.password,
            user.password,
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Password incorrect');
        }
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role
        }

        return { access_token: this.jwtService.sign(payload) };
    }

}
