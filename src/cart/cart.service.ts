import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(productId:string) {
        try {
            const cart =  await this.prisma.cart.create({
                data: {
                    
                }
            })
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        };
    };


}
