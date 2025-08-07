import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsUrl()
    @IsNotEmpty()
    image: string

    @IsNumber()
    @Min(0)
    price: number

    @IsNumber()
    @Min(0)
    stock: number

    @IsString()
    @IsNotEmpty()
    userId: string
}
