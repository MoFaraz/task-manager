import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto} from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    async signup(@Body() authRegisterDto: AuthRegisterDto) {
        return this.authService.register(authRegisterDto);
    }

    @Post('login')
    async signin(@Body() authLoginDto: AuthLoginDto) {
        return this.authService.login(authLoginDto);
    }

}
