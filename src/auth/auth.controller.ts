import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { register_dto } from './dto/register.dto';
import { login_dto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';

import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private auth_service: AuthService) { }

    @Post('register')
    registeruser(@Body() data: register_dto) {
        return this.auth_service.register_user(data);
    }

    @Post('login')
    loginUser(@Body() data: login_dto) {
        return this.auth_service.login_user(data);
    }

    @Get('verify')
    async verify_user(@Query('token') token: string, @Res() res: Response) {
        try {
            const { accessToken, refreshToken } = await this.auth_service.verify_user(
                token,
            );

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 12, // 12h
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            return res.json({
                message: 'User verified and logged in successfully',
            });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Req_with_user) {
        return this.auth_service.get_profile(req);
    }

    @Get('refresh')
    async refresh_token(@Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies['refreshToken'];

            if (!refreshToken) {
                throw new HttpException('Refresh token missing', 401);
            }

            const { accessToken } = await this.auth_service.refresh_token(refreshToken);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 12, // 12h
            });

            return res.json({ message: 'Access token refreshed' });
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        };
    };
};
