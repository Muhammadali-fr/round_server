import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category-dto";

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { };

    @Get()
    get_all() {
        return this.categoryService.get_categories();
    };

    @Get(':id')
    get_one(@Param('id') id: string) {
        return this.categoryService.get_one(id);
    };

    @Post()
    create(@Body() data: CreateCategoryDto) {
        console.log(data);
        return this.categoryService.create(data);
    };

    @Delete()
    delete_categories() {
        return this.categoryService.delete_categories();
    };

    @Delete(':id')
    delete_one(@Param('id') id: string) {
        return this.categoryService.delete_one(id);
    };
};