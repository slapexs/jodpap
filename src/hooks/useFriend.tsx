import { supabase } from "@/middlewares/supabase";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { friendStatusEnum } from "@/enums/friend";
import { User } from "@/types/user";

export default function useFriend() {
	const { user } = useAuth();
	const [friends, setFriends] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getFriendWithStatus = async (status?: friendStatusEnum) => {
		try {
			const { data } = await supabase
				.from("user_friends")
				.select("friend_id")
				.eq("user_id", user!.id)
				.eq("status", status);

			const friendIdList: string[] = [];

			data?.forEach((id) => friendIdList.push(id.friend_id));

			const { data: friendUser } = await supabase
				.from("users")
				.select("id, name, email, image_profile")
				.in("id", friendIdList);

			return friendUser;
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
	};

	const getUserFriends = async () => {
		setIsLoading(true);
		try {
			const { data } = await supabase
				.from("user_friends")
				.select("friend_id")
				.eq("user_id", user!.id)
				.eq("status", friendStatusEnum.ACCEPTED);

			const friendIdList: string[] = [];

			data?.forEach((id) => friendIdList.push(id.friend_id));

			const { data: friendUser } = await supabase
				.from("users")
				.select("id, name, email, image_profile")
				.in("id", friendIdList);
			setFriends(friendUser as User[]);
		} catch (error) {
			toast({ title: "เอ๊ะ!", description: (error as Error).message, duration: 3500, variant: "destructive" });
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getUserFriends();
	}, []);

	return { friends, isLoading, getUserFriends, getFriendWithStatus };
}

