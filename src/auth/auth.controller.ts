import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private auth_service: AuthService
    ) { }

    @Post('register')
    register_user(@Body() data: RegisterDto) {
        return this.auth_service.register(data)
    }

    @Post('login')
    login_user(@Body() data: LoginDto) {
        return this.auth_service.login(data)
    }

    @Get('verify')
    verify_user(@Query('token') token: string) {
        return this.auth_service.verify_user(token)
    }
}
