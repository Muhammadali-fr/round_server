import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class  RegisterDto{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;   
}