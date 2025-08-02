import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsString()
    categoryId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}