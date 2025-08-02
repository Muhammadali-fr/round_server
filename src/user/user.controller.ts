import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    findAll(){
        return this.userService.findAll()
    }

    @Post()
    findOne(@Body('email') email: string) {
        return this.userService.findOne(email)
    }
}
