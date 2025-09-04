"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { signUp } from "@/lib/auth";

export function RegisterForm() {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	});

	const registerMutation = useMutation({
		mutationFn: async (data: RegisterInput) => {
			const response = await signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				role: data.role,
			});

			if (!response.data) {
				throw new Error(response.error?.message || "Registration failed");
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

	const onSubmit = (data: RegisterInput) => {
		setError(null);
		registerMutation.mutate(data);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Sign Up</h1>
					<p className="text-gray-600 mt-2">Create your account</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
						{error}
					</div>
				)}

				<div className="space-y-4">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							placeholder="Enter your full name"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
						)}
					</div>

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

					<div>
						<Label htmlFor="role">Role</Label>
						<Select id="role" {...register("role")}>
							<option value="employee">Employee</option>
							<option value="hr">HR</option>
							<option value="admin">Admin</option>
						</Select>
						{errors.role && (
							<p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
						)}
					</div>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={registerMutation.isPending}
				>
					{registerMutation.isPending ? "Creating account..." : "Sign Up"}
				</Button>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<a href="/login" className="text-blue-600 hover:underline">
							Sign in
						</a>
					</p>
				</div>
			</form>
		</div>
	);
}
