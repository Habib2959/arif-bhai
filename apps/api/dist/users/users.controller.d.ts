import { User } from '../auth/auth.service';
export declare class UsersController {
    getAllUsers(user: User): Promise<{
        message: string;
        currentUser: User;
        users: {
            id: string;
            email: string;
            name: string;
            role: string;
            permissions: string[];
        }[];
    }>;
    getCurrentUser(user: User): Promise<{
        message: string;
        user: User;
    }>;
}
