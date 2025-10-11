import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  find_all(@Query('search') search: string) {
    if(search){
      return this.productService.searchProducts(search);
    }
    return this.productService.find_all();
  }

  @Post('image')
  @UseInterceptors(FilesInterceptor('images', 6))
  create_product_images(
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.productService.create_product_images(images)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.find_one(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(id, updateProductDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Req_with_user) {
    return this.productService.remove(id, req.user.id);
  }

  @Delete()
  delete_all() {
    return this.productService.delete_all();
  }
}
