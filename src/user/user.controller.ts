import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    findAll() {
        return this.userService.find_all()
    }

    @Get(":id")
    findOne(@Param('id') id: string) {
        return this.userService.find_one(id)
    }
}