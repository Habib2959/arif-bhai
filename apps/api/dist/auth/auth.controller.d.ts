import { Request, Response } from 'express';
export declare class AuthController {
    handleAuth(request: Request, response: Response): Promise<Response<any, Record<string, any>>>;
}
