"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Home() {
	const { data: session } = useSession();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Production-Ready Auth System
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						A complete authentication & authorization system built with NestJS,
						Next.js, PostgreSQL, and better-auth. Featuring role-based access
						control and granular permissions.
					</p>

					{session ? (
						<div className="space-y-4">
							<p className="text-lg text-gray-700">
								Welcome back, <strong>{session.user.name}</strong>!
							</p>
							<div className="space-x-4">
								<Button asChild>
									<Link href="/dashboard">Go to Dashboard</Link>
								</Button>
							</div>
						</div>
					) : (
						<div className="space-x-4">
							<Button asChild>
								<Link href="/login">Sign In</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href="/register">Sign Up</Link>
							</Button>
						</div>
					)}
				</div>

				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold mb-4">
							🔐 Secure Authentication
						</h3>
						<p className="text-gray-600">
							Built with better-auth for robust session management, secure
							cookies, and password hashing with Argon2.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold mb-4">👥 Role-Based Access</h3>
						<p className="text-gray-600">
							Hierarchical role system (Admin, HR, Employee) with granular
							permissions for fine-grained access control.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md">
						<h3 className="text-lg font-semibrel mb-4">🚀 Production Ready</h3>
						<p className="text-gray-600">
							Complete with security middleware, rate limiting, CORS protection,
							and comprehensive API documentation.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
