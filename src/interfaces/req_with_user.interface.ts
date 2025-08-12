import { Request } from "express";

export interface Req_with_user extends Request {
    user: {
        id:  string;
        email: string;
        name?: string;
    };
}