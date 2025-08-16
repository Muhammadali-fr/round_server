import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import type { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Req() req: Req_with_user
  ) {
    return this.productService.create(createProductDto, req.user.id, files);
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


  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 6))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Req_with_user,
  ) {
    return this.productService.uploadProductImages(id, files, req.user.id);
  }
}
