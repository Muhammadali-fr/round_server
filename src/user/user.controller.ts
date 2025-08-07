import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  find_all() {
    return this.userService.find_all();
  }

  @Get(':id')
  find_one(@Param('id') id: string) {
    return this.userService.find_one(id);
  }
}
