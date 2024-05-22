import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UsersService){}

    async signup(signupDto: SignupDto) {
        const {username, email, password} = signupDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userService.createUser({
            email,
            password: hashedPassword,
            username,
            role: 'USER'
        });

        const payload = {
            username: (await user).username,
            sub: (await user).id,
            role: (await user).role
        };

        return { access_token: this.jwtService.sign(payload) };
    }

    async signin(signinDto: SigninDto) {
        const {username, password} = signinDto;
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new UnauthorizedException('Invalid Credentials');

        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role
        }

        return { access_token: this.jwtService.sign(payload) };
    }

}
