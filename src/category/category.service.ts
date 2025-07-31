import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { slugify } from 'src/utils/slugify';


@Injectable()
export class CategoryService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(data: Prisma.CategoryCreateInput) {
    const existing = await this.prisma.category.findFirst({
      where: {
        name: data.name
      }
    })

    if (existing) {
      throw new ConflictException("category already exists");
    }

    const slug = slugify(data.name);

    try {
      const category = await this.prisma.category.create({
        data: {
          name: data.name,
          slug
        }
      }) 

      return category;
    } catch (error) {
        throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
