import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Req_with_user
  ) {
    return this.productService.create(createProductDto, req.user.id);
  }

  @Get()
  find_all() {
    return this.productService.find_all();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.find_one(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
