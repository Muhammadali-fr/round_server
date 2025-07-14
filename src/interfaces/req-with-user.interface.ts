import { Request } from "express";

export interface ReqWithUser extends Request {
    user: {
        id: number | string;
        email: string;
        name?: string;
    };
}