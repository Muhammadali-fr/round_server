import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested } from "class-validator";
import { CreateProductImageDto } from "./create-product-image.dto";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    image: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}