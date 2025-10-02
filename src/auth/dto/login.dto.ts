import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class login_dto{
    @IsString()
    @IsNotEmpty()
    email: string;
}
