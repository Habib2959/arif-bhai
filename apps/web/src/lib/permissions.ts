import { User } from "./auth";

export const hasPermission = (
	user: User | null,
	permission: string
): boolean => {
	if (!user) return false;
	return user.permissions.includes(permission);
};

export const hasRole = (user: User | null, role: string): boolean => {
	if (!user) return false;

	const roleHierarchy = {
		admin: ["admin", "hr", "employee"],
		hr: ["hr", "employee"],
		employee: ["employee"],
	};

	return (
		roleHierarchy[user.role as keyof typeof roleHierarchy]?.includes(role) ||
		false
	);
};

export const canViewDashboard = (user: User | null): boolean => {
	return hasPermission(user, "can_view_dashboard");
};

export const canManageUsers = (user: User | null): boolean => {
	return hasPermission(user, "can_manage_users");
};
