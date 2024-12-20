import { IUserFriend } from "@/types";
import Loading from "@/components/Loading/Loading";
import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { supabase } from "@/middlewares/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CircleXIcon, Loader2Icon, LoaderIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { friendStatusEnum } from "@/enums/friend.ts";
import { IFriendResult } from "@/types/friend.ts";
import { User } from "@/types/user.ts";
import NewFriendRequest from "@/components/Friend/NewFriendRequest";

export default function SearchFriend() {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [addIsLoading, setAddIsLoading] = useState<boolean>(false);
	const [isShowList, setIsShowList] = useState<boolean>(false);
	const [pendingFriends, setPendingFriends] = useState<User[]>([]);

	const [users, setUsers] = useState<IFriendResult[]>([]);

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
		const friendResult: IFriendResult[] = [];
		setIsLoading(true);
		try {
			const { data: userFound } = await supabase
				.from("users")
				.select("id, email, name, image_profile")
				.neq("id", user!.id)
				.like("name", `%${values.name}%`);

			const { data: friendFound } = await supabase
				.from("user_friends")
				.select("*")
				.eq("user_id", user!.id)
				.neq("status", friendStatusEnum.BLOCKED);

			userFound?.forEach((user: User) => {
				const checkIsFriend = friendFound?.find((friend: IUserFriend) => friend.friend_id === user.id);
				friendResult.push({
					user,
					isFriend: checkIsFriend !== undefined,
					status: checkIsFriend !== undefined ? checkIsFriend.status : null,
				});
			});
			setUsers(friendResult);
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
		setIsLoading(false);
		setIsShowList(true);
	};

	const updateAddFriendButtonState = async (friendId: string) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.user.id === friendId ? { ...user, isFriend: true, status: friendStatusEnum.PENDING } : user
			)
		);
	};

	const addFriend = async (friendId: string) => {
		setAddIsLoading(true);
		try {
			await supabase
				.from("user_friends")
				.insert([
					{ user_id: user!.id, friend_id: friendId, status: friendStatusEnum.PENDING, who_add_id: user!.id },
					{ user_id: friendId, friend_id: user!.id, status: friendStatusEnum.PENDING, who_add_id: user!.id },
				])
				.select();
			updateAddFriendButtonState(friendId);
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
		setAddIsLoading(false);
	};

	const getPendingFriends = async () => {
		const { data: friendPendingList } = await supabase
			.from("user_friends")
			.select("friend_id")
			.neq("who_add_id", user!.id)
			.eq("user_id", user!.id)
			.eq("status", friendStatusEnum.PENDING);

		const friendIdList: string[] = [];
		friendPendingList?.forEach((id) => friendIdList.push(id.friend_id));
		const { data: pendingFriends } = await supabase
			.from("users")
			.select("id, name, email, image_profile")
			.in("id", friendIdList);

		setPendingFriends((prevFriends) => {
			const updatedFriends = prevFriends.map((user) =>
				pendingFriends?.some((u) => u.id === user.id) ? { ...user, status: friendStatusEnum.PENDING } : user
			);

			const newFriends =
				pendingFriends?.filter((newUser) => !prevFriends.some((user) => user.id === newUser.id)) || [];

			return [...updatedFriends, ...newFriends];
		});
	};
	const trigger = (userId: string) => {
		setPendingFriends((prevFriend) => prevFriend.filter((friend) => friend.id !== userId));
	};

	useEffect(() => {
		getPendingFriends();
	}, []);

	return (
		<MainLayout>
			<PageTitle title="ค้นหาเพื่อน" />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="p-0 space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="พิมพ์ชื่อเพื่อนใหม่" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" variant={"default"} className="w-full" size={"lg"} disabled={isLoading}>
							ตกลง
						</Button>
					</CardContent>
				</form>
			</Form>

			{!isLoading ? (
				isShowList ? (
					<div className="mt-10">
						<h1 className="font-medium">คนที่เราเจอ</h1>
						{users.length > 0 ? (
							users.map((u) => (
								<div key={u.user.id} className="my-1 py-1 flex justify-between items-center">
									<div className="flex gap-3 items-center">
										<Avatar>
											<AvatarImage
												src={`${
													import.meta.env.VITE_SUPABASE_PROJECT_URL
												}/storage/v1/object/public/user_image_profile/${u.user.image_profile}`}
												alt="avatar"
											/>
										</Avatar>
										<div className="flex flex-col">
											<Label className="text-md">{u.user.name}</Label>
											<Label className="text-xs text-gray-400">{u.user.email}</Label>
										</div>
									</div>

									{!u.isFriend ? (
										<Button
											type="button"
											variant={"default"}
											size={"icon"}
											disabled={addIsLoading}
											onClick={() => addFriend(u.user.id)}
										>
											{addIsLoading ? <Loader2Icon className="animate-spin" /> : <UserPlusIcon />}
										</Button>
									) : (
										<Button type="button" variant={"outline"} size={"icon"} disabled>
											{u.status === friendStatusEnum.PENDING ? (
												<LoaderIcon />
											) : u.status === friendStatusEnum.BLOCKED ? (
												<CircleXIcon />
											) : (
												<CheckIcon />
											)}
										</Button>
									)}
								</div>
							))
						) : (
							<h1 className="text-gray-400 mt-2">ไม่พบใครเลย</h1>
						)}
					</div>
				) : (
					<NewFriendRequest friends={pendingFriends} triggerLoadPendingFriend={trigger} />
				)
			) : (
				<Loading />
			)}
		</MainLayout>
	);
}

