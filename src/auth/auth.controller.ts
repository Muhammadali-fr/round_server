import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { register_dto } from './dto/register.dto';
import { login_dto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';
import type { Response, Request } from 'express';

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
    async verify_user(@Query("token") token: string, @Res() res: Response) {
        const result = await this.auth_service.verify_user(token);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }


    @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Req() req: Req_with_user) {
        return this.auth_service.get_profile(req);
    }

    @Post('refresh')
    async refresh_token(@Req() req: Request, @Res() res: Response) {
        const refresh_token_req = req.cookies['refreshToken'];

        if (!refresh_token_req) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const newTokens = await this.auth_service.refresh_token(refresh_token_req);

        res.cookie('accessToken', newTokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken: newTokens.accessToken });
    }
}
