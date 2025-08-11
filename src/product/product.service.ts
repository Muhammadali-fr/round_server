import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {

  constructor(
    private database: DatabaseService
  ) { }

  async create(createProductDto: CreateProductDto, user: any) {
    try {

      return user

      const product = await this.database.product.create({
        data: createProductDto
      })

      return product;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async find_all() {
    return await this.database.product.findMany();
  }

  async find_one(id: string) {
    const product = await this.database.product.findUnique({
      where: { id }
    })

    if (!product) throw new NotFoundException('product not found');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.database.product.findUnique({
      where: { id }
    })

    if (!product) throw new NotFoundException('product not found')

    const updated_product = await this.database.product.update({
      where: { id },
      data: updateProductDto
    })

    return updated_product;
  }

  async remove(id: string) {
    const product = await this.database.product.delete({
      where: { id }
    })

    if (!product) throw new NotFoundException('product not found')

    return 'deleted successfully'
  }
}
