import { Injectable } from '@nestjs/common';
import { auth } from './auth.config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  async verifySession(sessionToken: string): Promise<User | null> {
    try {
      const headers = new Headers();
      headers.append('authorization', `Bearer ${sessionToken}`);

      const session = await auth.api.getSession({
        headers,
      });

      if (!session?.user) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role || 'employee',
        permissions: (session.user as any).permissions || [],
      };
    } catch (error) {
      return null;
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    permissions?: string[];
  }) {
    return auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role || 'employee',
        permissions: userData.permissions || [],
      },
    });
  }

  hasPermission(
    userPermissions: string[],
    requiredPermission: string,
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  hasRole(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
      admin: ['admin', 'hr', 'employee'],
      hr: ['hr', 'employee'],
      employee: ['employee'],
    };

    return (
      roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(
        requiredRole,
      ) || false
    );
  }
}
