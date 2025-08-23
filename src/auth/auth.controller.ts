import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { register_dto } from './dto/register.dto';
import { login_dto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';

@Controller('auth')
export class AuthController {

    constructor(
        private auth_service: AuthService
    ) { }

    @Post("register")
    registeruser(@Body() data: register_dto) {
        return this.auth_service.register_user(data);
    }

    @Post("login")
    loginUser(@Body() data: login_dto) {
        return this.auth_service.login_user(data)
    }

    @Get("verify")
    async verify_user(@Query("token") token: string) {
        return this.auth_service.verify_user(token)
    }


    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Req() req: Req_with_user) {
        return this.auth_service.get_profile(req);
    }

    @Post('refresh')
    async refresh_token(@Body("token") token: string) {
        return this.auth_service.refresh_token(token);
    }
}
