// FIX: We need to import Request from 'express' instead of '@nestjs/common'
import { Request } from "express";

export interface ReqWithUser extends Request {
    user: {
        email: string;
        name?: string;
        // FIX: The user object from your JWT payload also contains an action property
        action: 'access';
    }
}
