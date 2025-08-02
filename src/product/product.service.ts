import { ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReqWithUser } from 'src/interfaces/req-with-user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(userId: string, dto: CreateProductDto ) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    })

    console.log(userId, user);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.role !== 'SELLER' && user.role === "ADMIN") {
      throw new ForbiddenException("only sellers can create product")
    }

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          description:dto.name,
          price: dto.price
        }
      })
    } catch  (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new InternalServerErrorException("something wen wrong while fetching products.");
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} is not found.`);
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data
      });

      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({ where: { id } });
      return { message: `product with id ${id} deleted succesfully` }
    } catch (error) {
      throw new InternalServerErrorException(`failed to delete id ${id} product.`)
    }
  }
}
