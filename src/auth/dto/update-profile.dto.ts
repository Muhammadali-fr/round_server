import { IsOptional, IsString } from "class-validator";

export class updateProfileDto{
    @IsString()
    @IsOptional()
    name: string

    
}