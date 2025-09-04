"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { loginSchema, LoginInput } from "@/lib/validations";
import { signIn } from "@/lib/auth";

export function LoginForm() {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const loginMutation = useMutation({
		mutationFn: async (data: LoginInput) => {
			const response = await signIn.email({
				email: data.email,
				password: data.password,
			});

			if (!response.data) {
				throw new Error(response.error?.message || "Login failed");
			}

			return response.data;
		},
		onSuccess: () => {
			router.push("/dashboard");
		},
		onError: (error: Error) => {
			setError(error.message);
		},
	});

	const onSubmit = (data: LoginInput) => {
		setError(null);
		loginMutation.mutate(data);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Sign In</h1>
					<p className="text-gray-600 mt-2">Welcome back to your account</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
						{error}
					</div>
				)}

				<div className="space-y-4">
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-red-600 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-red-600 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={loginMutation.isPending}
				>
					{loginMutation.isPending ? "Signing in..." : "Sign In"}
				</Button>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<a href="/register" className="text-blue-600 hover:underline">
							Sign up
						</a>
					</p>
				</div>
			</form>
		</div>
	);
}
