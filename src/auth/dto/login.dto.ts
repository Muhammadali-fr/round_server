import { IsEmpty, IsString } from "class-validator";

export class login_dto{
    @IsString()
    @IsEmpty()
    email: string;
}