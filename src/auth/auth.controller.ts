import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto} from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    async signup(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto) {
        return this.authService.register(authRegisterDto);
    }

    @Post('login')
    async signin(@Body(ValidationPipe) authLoginDto: AuthLoginDto) {
        return this.authService.login(authLoginDto);
    }

}
