import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category-dto";

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async get_products() {
        try {
            return await this.prisma.category.findMany();
        } catch (r) {
            throw new InternalServerErrorException(r.message);
        }
    }

    async get_one(id: string) {
        try {
            const category = await this.prisma.category.findUnique({ where: { id } });

            if (!category) {
                throw new HttpException('category not found', 404);
            };

            return category;
        } catch (r) {
            throw new InternalServerErrorException(r.message);
        };
    };

    async create(data: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({ data });
        } catch (r) {
            throw new InternalServerErrorException(r.message);
        };
    };
};