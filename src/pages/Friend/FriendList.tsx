import Loading from "@/components/Loading/Loading";
import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import useFriend from "@/hooks/useFriend";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { deleteFriend } from "@/utils/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVerticalIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FriendList() {
	const { user } = useAuth();
	const { friends, isLoading, getUserFriends } = useFriend();
	const [addIsLoading, setAddIsLoading] = useState<boolean>(false);
	const [isShowList, setIsShowList] = useState<boolean>(true);
	const formSchema = z.object({
		name: z
			.string({ message: "บอกหน่อยให้ค้นหาเพื่อนชื่อว่าอะไร" })
			.min(3, "ชื่อต้องยาวอย่างน้อย 3 ตัว")
			.max(25, "ชื่อยาวได้ไม่เกิน 25 ตัว"),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setAddIsLoading(true);

		try {
			await supabase.from("friends").insert([
				{
					loaner_id: user?.id,
					borrower_name: values.name,
				},
			]);
			await getUserFriends();
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}

		setAddIsLoading(false);
		setIsShowList(true);
	};
	return (
		<MainLayout>
			<PageTitle title="เพื่อน" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="p-0 space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="เพิ่มเพื่อนใหม่" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							variant={"default"}
							className="w-full"
							size={"lg"}
							disabled={addIsLoading}
						>
							{addIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							ตกลง
						</Button>
					</CardContent>
				</form>
			</Form>

			{!isLoading ? (
				isShowList && (
					<div className="mt-10">
						<h1 className="font-medium">เพื่อนทั้งหมด</h1>
						{friends.length > 0 ? (
							friends.map((u) => (
								<div key={u.id} className="my-1 py-2 flex justify-between items-center">
									<div className="flex gap-3 items-center">
										<Avatar>
											<AvatarImage
												src={`${
													import.meta.env.VITE_SUPABASE_PROJECT_URL
												}/storage/v1/object/public/user_image_profile/${u.image_profile}`}
												alt="avatar"
											/>
										</Avatar>
										<div className="flex flex-col">
											<Label className="text-md">{u.name}</Label>
										</div>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button type="button" variant={"outline"} size={"icon"}>
												<EllipsisVerticalIcon />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>แก้ไข</DropdownMenuItem>
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant={"link"}
														className="text-left px-2 text-destructive"
													>
														ลบเพื่อน
													</Button>
												</DialogTrigger>

												<DialogContent className="max-w-[350px] rounded-lg">
													<DialogHeader>
														<DialogTitle>ลบเพื่อน</DialogTitle>
														<DialogDescription>
															ยืนยันว่าต้องการลบ {u.name} ออกจากรายชื่อเพื่อน?
														</DialogDescription>
													</DialogHeader>

													<DialogFooter>
														<Button type="button" onClick={() => deleteFriend(u.id)}>
															ตกลง
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))
						) : (
							<h1 className="text-gray-400 mt-2">ไม่พบใครเลย</h1>
						)}
					</div>
				)
			) : (
				<Loading />
			)}
		</MainLayout>
	);
}

