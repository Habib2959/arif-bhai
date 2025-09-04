"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_config_1 = require("./auth.config");
let AuthService = class AuthService {
    async verifySession(sessionToken) {
        try {
            const headers = new Headers();
            headers.append('authorization', `Bearer ${sessionToken}`);
            const session = await auth_config_1.auth.api.getSession({
                headers,
            });
            if (!session?.user) {
                return null;
            }
            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role || 'employee',
                permissions: session.user.permissions || [],
            };
        }
        catch (error) {
            return null;
        }
    }
    async createUser(userData) {
        return auth_config_1.auth.api.signUpEmail({
            body: {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role || 'employee',
                permissions: userData.permissions || [],
            },
        });
    }
    hasPermission(userPermissions, requiredPermission) {
        return userPermissions.includes(requiredPermission);
    }
    hasRole(userRole, requiredRole) {
        const roleHierarchy = {
            admin: ['admin', 'hr', 'employee'],
            hr: ['hr', 'employee'],
            employee: ['employee'],
        };
        return roleHierarchy[userRole]?.includes(requiredRole) || false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map