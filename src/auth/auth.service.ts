// dtos 
import { RegisterDto } from './dto/register.dto';

// prisma 
import { PrismaService } from '../prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async registerUser(data: RegisterDto) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        // check if user already exists
        if( existUser ) {
            throw new Error('User already exists, please login instead.');
        }
        

    }

}
