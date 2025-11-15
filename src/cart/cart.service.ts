import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(productId: string, userId: string) {
        try {

            let cart = await this.prisma.cart.findFirst({
                where: {
                    userId
                }
            });

            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { userId }
                });
            };

            let existingItem = await this.prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId
                }
            });

            if (existingItem) {
                return await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + 1 },
                });
            };

            const newCartItem = await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                },
            });

            return { cart, newCartItem }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        };
    };


}
