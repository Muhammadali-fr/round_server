import { Injectable } from '@nestjs/common';

// prisma 
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {

    constructor(private prisma: PrismaService) { }

    async getCart(userId: string) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: true }
        })
    }

    async addToCart(userId: string, productId: string, quantity: number = 1) {
        let cart = this.prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId
                }
            })
        }
    }

}
