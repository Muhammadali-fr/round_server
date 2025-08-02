import { Body, Controller, Post, Query, Get, UseGuards, Req, UseInterceptors, Patch, UploadedFile } from '@nestjs/common';

// services 
import { AuthService } from './auth.service';

// dtos 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// guards 
import { AuthGuard } from '../guards/auth/auth.guard';
import { ReqWithUser } from 'src/interfaces/req-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("register")
    registeruser(@Body() data: RegisterDto) {
        return this.authService.registerUser(data);
    }

    @Post("login")
    loginUser(@Body() data: LoginDto) {
        return this.authService.loginUser(data)
    }

    @Get("verify-magic-link")
    verifyMagicLink(@Query("token") token: string) {
        return this.authService.verifyToken(token);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(@Req() req: ReqWithUser) {
        return this.authService.getProfile(req);
    }


    @Get('/reset')
    reset(@Query("token") token: string) {
        return this.authService.resetToken(token)
    }

    @Patch('/update')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    updateProfile(
        @Req() req: ReqWithUser,
        @UploadedFile() file?: Express.Multer.File,
        @Body('name') name?: string,
        @Body('role') role?: 'CUSTOMER' | 'ADMIN'
    ) {
        return this.authService.updateProfile(req, file, name, role)
    }

}
