import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {

    constructor(
        private prisma: PrismaService
    ) { }


    async create(){
        return await this.prisma.tag.findMany()
    }
}
