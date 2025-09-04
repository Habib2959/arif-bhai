"use client";

import { useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	const { data: users, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3001/users", {
				credentials: "include",
				headers: {
					Authorization: `Bearer ${session?.session.id}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			return response.json();
		},
		enabled: !!session,
	});

	if (isPending || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<h1 className="text-3xl font-bold text-gray-900">
							User Management
						</h1>
						<Button onClick={() => router.push("/dashboard")} variant="outline">
							Back to Dashboard
						</Button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow overflow-hidden sm:rounded-md">
						<ul className="divide-y divide-gray-200">
							{users?.users?.map((user: any) => (
								<li key={user.id}>
									<div className="px-4 py-4 flex items-center justify-between">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
													<span className="text-sm font-medium text-gray-700">
														{user.name.charAt(0).toUpperCase()}
													</span>
												</div>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{user.name}
												</div>
												<div className="text-sm text-gray-500">
													{user.email}
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{user.role}
											</span>
											<div className="text-sm text-gray-500">
												{user.permissions.join(", ")}
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
}
