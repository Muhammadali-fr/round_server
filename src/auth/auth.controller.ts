import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { register_dto } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private auth_service: AuthService
    ) { }

    @Post('register')
    register(@Body() data: register_dto) {
        return this.auth_service.register_user(data)
    }


}
