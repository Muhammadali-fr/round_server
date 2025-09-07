import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category-dto";

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async get_categories() {
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

    async delete_categories() {
        try {
            await this.prisma.category.deleteMany();
            return 'delted succesfully';
        } catch (r) {
            throw new InternalServerErrorException(r.message);
        };
    };

    async delete_one(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundException('category not found');
        }

        try {
            await this.prisma.category.delete({ where: { id } });
            return 'deleted succesfully';
        } catch (r) {
            throw new InternalServerErrorException(r.message);
        };
    }
};