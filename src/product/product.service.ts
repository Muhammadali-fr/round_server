import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {

  constructor(
    private database: DatabaseService
  ) { }

  async create(createProductDto: CreateProductDto) {
    return await this.database.product.create({ data: createProductDto });
  }

  findAll() {
    return this.database.product.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
