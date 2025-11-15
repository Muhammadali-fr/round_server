import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { AddItemDto } from './dto/addItemDto';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { };

    @UseGuards(JwtAuthGuard)
    @Post()
    createCart(
        @Body() dto: AddItemDto,
        @Req() req: Req_with_user
    ) {
        return this.cartService.create(dto.productId, req.user.id)
    };
};
