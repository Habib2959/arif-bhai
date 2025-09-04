"use client";

import { useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { hasRole, canManageUsers } from "@/lib/permissions";

export default function DashboardPage() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	const user = session.user;

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-700">
								Welcome, {user.name} ({user.role})
							</span>
							<Button onClick={handleSignOut} variant="outline">
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{/* User Info Card */}
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg leading-6 font-medium text-gray-900">
									Your Profile
								</h3>
								<div className="mt-2 text-sm text-gray-500">
									<p>Email: {user.email}</p>
									<p>Role: {user.role}</p>
									<p>Permissions: {user.permissions.join(", ")}</p>
								</div>
							</div>
						</div>

						{/* Admin Only - Users Management */}
						{canManageUsers(user) && (
							<div className="bg-white overflow-hidden shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Manage Users
									</h3>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Access user management features
										</p>
										<div className="mt-3">
											<Button
												onClick={() => router.push("/admin/users")}
												size="sm"
											>
												View All Users
											</Button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* HR Features */}
						{hasRole(user, "hr") && (
							<div className="bg-white overflow-hidden shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										HR Features
									</h3>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Access HR management tools
										</p>
										<div className="mt-3">
											<Button size="sm" variant="outline">
												Employee Reports
											</Button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* General Employee Features */}
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg leading-6 font-medium text-gray-900">
									Employee Portal
								</h3>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Access your employee resources
									</p>
									<div className="mt-3">
										<Button size="sm" variant="outline">
											View Schedule
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
