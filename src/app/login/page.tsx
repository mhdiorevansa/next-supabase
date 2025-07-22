"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SupabaseBrowserClient from "@/lib/supabase/client";

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { error } = await SupabaseBrowserClient.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			console.log(error);
			toast.error("Sepertinya ada kesalahan");
		}
		toast.success("Berhasil login");
		router.push("/admin");
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">Login ke Akun Anda</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
					<p className="mt-4 text-center text-sm text-muted-foreground">
						Belum punya akun?{" "}
						<Link href="/register" className="text-primary underline">
							Daftar sekarang
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
