import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    @ApiOperation({ summary: 'User signup' })
    @ApiResponse({ status: 201, description: 'User created and logged in' })
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('signin')
    @ApiOperation({ summary: 'User signin' })
    @ApiResponse({ status: 200, description: 'User logged in' })
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }

}
