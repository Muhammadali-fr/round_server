// create-product-image.dto.ts
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
