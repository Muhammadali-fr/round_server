import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createProductDto: CreateProductDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.role !== 'SELLER') {
      throw new ForbiddenException("only sellers can create product")
    }

    try {
      return await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          image: createProductDto.image,
          price: createProductDto.price,
          UserId: user.id,
          images: {
            create: createProductDto.images.map((img): { url: string } => ({
              url: img.url,
            }))
          }
        },
        include: {
          images: true
        }
      });

    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async find_all() {
    try {
      return this.prisma.product.findMany()
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async find_one(id: string) {
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

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...rest } = updateProductDto;

    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          ...rest,
          ...(images && {
            images: {
              deleteMany: {},
              create: images.map((img) => ({ url: img.url }))
            }
          })
        },
        include: {
          images: true
        }
      });

      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    try {
      await this.prisma.product_images.deleteMany({
        where: { productId: id },
      });

      const deleted_product = await this.prisma.product.delete({
        where: { id },
      });

      return {message: `Product named ${deleted_product.name} deleted successfully.`}

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}

