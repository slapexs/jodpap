"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Login() {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { signIn } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const formSchema = z.object({
		email: z.string().email("กรอกอีเมลให้ถูกต้องด้วย"),
		password: z.string().min(6, "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว").max(50, "รหัสผ่านยาวได้ไม่เกิน 50 ตัว"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			await signIn(values.email, values.password);
			console.log("OK");
			navigate("/note");
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
		setIsLoading(false);
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8">
			<main className="min-h-screen w-full flex items-center">
				<Card className="w-full min-w-[350px]">
					<CardHeader>
						<CardTitle>ล็อกอิน</CardTitle>
						<CardDescription>บอกเราหน่อยคุณคือใคร?</CardDescription>
					</CardHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>อีเมล</FormLabel>
											<FormControl>
												<Input placeholder="user@gmail.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>รหัสผ่าน</FormLabel>
											<FormControl>
												<Input placeholder="************" type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="block text-center">
								<Button type="submit" variant={"default"} className="w-full" disabled={isLoading}>
									{isLoading && <Loader2 className="animate-spin" />}
									ตกลง
								</Button>
								<p className="mt-3">
									<span className="text-neutral-400">ยังไม่มีบัญชีใช่ไหม?</span>{" "}
									<Button type="button" variant={"link"}>
										สมัคร
									</Button>
								</p>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</main>
		</div>
	);
}

