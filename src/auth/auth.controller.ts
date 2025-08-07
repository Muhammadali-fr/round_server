import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ReqWithUser } from 'src/interface/req_with_user.interface';
import { AuthGuard } from 'src/guards/auth.guard';

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

    @UseGuards(AuthGuard)
    @Get('profile')
    get_profile(@Req() req: Request & ReqWithUser){
        return this.auth_service.get_profile(req.user)
    }
}
