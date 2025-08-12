import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class register_dto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}