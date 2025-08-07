import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private auth_service: AuthService
    ) { }

    @Post('register')
    register_user(@Body() data: RegisterDto) {
        return this.auth_service.register(data)
    }
}
