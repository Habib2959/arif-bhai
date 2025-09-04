export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
}
export declare class AuthService {
    verifySession(sessionToken: string): Promise<User | null>;
    createUser(userData: {
        email: string;
        password: string;
        name: string;
        role?: string;
        permissions?: string[];
    }): Promise<{
        token: null;
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null | undefined;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } | {
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            image: string | null | undefined;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    hasPermission(userPermissions: string[], requiredPermission: string): boolean;
    hasRole(userRole: string, requiredRole: string): boolean;
}
