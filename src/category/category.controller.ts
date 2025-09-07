import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category-dto";

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { };

    @Get()
    get_all() {
        return this.categoryService.get_products();
    };

    @Get(':id')
    get_one(@Param('id') id: string) {
        return this.categoryService.get_one(id);
    };

    @Post()
    create(@Body() data: CreateCategoryDto) {
        return this.categoryService.create(data);
    };
};