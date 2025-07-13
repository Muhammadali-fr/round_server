import { IsEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsEmpty()
    email: string;
}