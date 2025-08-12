import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit { 
    onModuleInit() {
        this.$connect()
        .then(() => console.log("database connected"))
        .catch((err) => console.log(err))
    }
}
