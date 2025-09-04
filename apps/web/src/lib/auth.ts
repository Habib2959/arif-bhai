import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

export interface User {
	id: string;
	email: string;
	name: string;
	role: string;
	permissions: string[];
}

export interface Session {
	user: User;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
}
