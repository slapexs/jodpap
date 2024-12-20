import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Loading from "../Loading/Loading";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";
import { friendStatusEnum } from "@/enums/friend";
import { useEffect, useState } from "react";
import { supabase } from "@/middlewares/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface IFriendProps {
	friends: User[];
	isLoading: boolean;
}

export default function Friend({ friends, isLoading }: IFriendProps) {
	const { user } = useAuth();
	const [pendingFriendCount, setPendingFriendCount] = useState<number>(0);

	const pendingFriendsCount = async () => {
		try {
			const { data } = await supabase
				.from("user_friends")
				.select("friend_id")
				.eq("friend_id", user!.id)
				.neq("who_add_id", user!.id)
				.eq("status", friendStatusEnum.PENDING);

			const friendIdList: string[] = [];

			data?.forEach((id) => friendIdList.push(id.friend_id));

			const { data: friendUser } = await supabase
				.from("users")
				.select("id, name, email, image_profile")
				.in("id", friendIdList);
			setPendingFriendCount(friendUser?.length ?? 0);
			return friendUser;
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
	};

	useEffect(() => {
		pendingFriendsCount();
	}, []);
	return (
		<div className="rounded-lg shadow px-3 py-2">
			<div className="flex justify-between">
				<h1 className="font-semibold">เพื่อน</h1>
				<Link to={"/search-friend"}>
					<Button type="button" variant={"outline"} size={"icon"} className="relative">
						<UserPlusIcon />
						{pendingFriendCount > 0 && (
							<div className="absolute -top-2 -right-2 bg-red-500 w-4 h-4 rounded-full"></div>
						)}
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<Loading />
			) : (
				<section className="grid grid-cols-5">
					{friends.length > 0 ? (
						friends.map((friend) => (
							<Link to={`/friend/${friend.id}`} key={friend.id}>
								<div className="flex justify-center flex-col items-center w-fit">
									<Avatar className="mt-1">
										<AvatarImage
											src={`${
												import.meta.env.VITE_SUPABASE_PROJECT_URL
											}/storage/v1/object/public/user_image_profile/${friend.image_profile}`}
											alt="avatar"
										/>
									</Avatar>
									<Label className="mt-1">{friend.name ?? "-"}</Label>
								</div>
							</Link>
						))
					) : (
						<p className="text-gray-400 text-center">ว่างเปล่า</p>
					)}
				</section>
			)}

			<p className="text-center text-sm mt-2">
				<Link to={"/friends"}>ดูทั้งหมด</Link>
			</p>
		</div>
	);
}

