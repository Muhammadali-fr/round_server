import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

// dtos 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post("register")
    registeruser(@Body() data: RegisterDto){
        return this.authService.registerUser(data);
    }

    @Post("login")
    loginUser(@Body() data: LoginDto){
        return this.authService.loginUser(data)
    }

    @Get("verify-magic-link")
    verifyMagicLink(@Query("token") token: string){
        return this.authService.verifyToken(token);
    }
}
