import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

// dtos 
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post("register")
    registeruser(@Body() data: RegisterDto){
        return this.authService.registerUser(data);
    }
}
