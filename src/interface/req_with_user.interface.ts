import { Request } from "@nestjs/common";

export interface ReqWithUser extends Request{
    user: {
        email: string;
        name?: string;
    }
}