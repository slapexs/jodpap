"use client";

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { uploadImageProfile } from "@/utils/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Profile() {
	const { user, getUserSession } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const formSchema = z.object({
		email: z.string().readonly(),
		name: z
			.string({ message: "บอกหน่อยให้เราเรียกคุณว่าอะไร" })
			.min(3, "ชื่อต้องยาวอย่างน้อย 3 ตัว")
			.max(25, "ชื่อยาวได้ไม่เกิน 25 ตัว"),
		image_profile: z
			.any() // Start with any to validate files
			.refine((file) => file instanceof File, {
				message: "โปรดอัพโหลดไฟล์ที่ถูกต้อง",
			})
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB",
			})
			.refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
				message: "รองรับเฉพาะไฟล์ประเภท JPEG, PNG, หรือ GIF",
			})
			.optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			image_profile: undefined,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const filePath: string | undefined =
				values.image_profile !== undefined ? await uploadImageProfile(values.image_profile) : undefined;
			await supabase
				.from("users")
				.update({
					name: values.name,
					image_profile: values.image_profile !== undefined ? filePath : user?.image_profile,
				})
				.eq("id", user?.id);
			toast({ title: "เย้!", description: "แก้ไขโปรไฟล์เรียบร้อย" });
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}

		getUserSession();
		setIsLoading(false);
	};
	return (
		<MainLayout>
			<PageTitle title="โปรไฟล์" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="p-0 space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>ชื่อเล่น</FormLabel>
									<FormControl>
										<Input placeholder="Jenny" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>อีเมล</FormLabel>
									<FormControl>
										<Input placeholder="user@gmail.com" {...field} readOnly disabled />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image_profile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>รูปโปรไฟล์</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => field.onChange(e.target.files?.[0])} // Capture the file
											onBlur={field.onBlur}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<Button type="submit" variant={"default"} size={"lg"} className="mt-4 w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						ตกลง
					</Button>
				</form>
			</Form>
		</MainLayout>
	);
}

