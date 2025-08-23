import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(
        private readonly user_service: UserService
    ) { }

    @Get()
    findAll() {
        return this.user_service.find_all()
    }

    @Get(":id")
    findOne(@Param('id') id: string) {
        return this.user_service.find_one(id)
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    update_profile(
        @Req() req: Req_with_user,
        @UploadedFile() file?: Express.Multer.File,
        @Body('name') name?: string,
        @Body('role') role?: 'CUSTOMER' | 'SELLER',
    ) {
        return this.user_service.update_profile(req, file, name, role);
    }

    @Delete(':id')
    delete_user(@Param('id') user_id: string) {
        return this.user_service.delete_user(user_id);
    }
}