import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Req_with_user } from 'src/interfaces/req_with_user.interface';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { };

    @UseGuards(JwtAuthGuard)
    @Post()
    createCart(
        @Body() productId: string,
        @Req() req: Req_with_user
    ) {
        return this.cartService.create(productId)
    };
};
