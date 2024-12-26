import { User } from "@/types/user";
import PageTitle from "../PageTitle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { supabase } from "@/middlewares/supabase";
import { friendStatusEnum } from "@/enums/friend";

interface INewFriendRequest {
	friends: User[];
	triggerLoadPendingFriend: (userId: string) => void;
}

export default function NewFriendRequest({ friends, triggerLoadPendingFriend }: INewFriendRequest) {
	const acceptFriend = async (friendId: string) => {
		await supabase
			.from("user_friends")
			.update({
				status: friendStatusEnum.ACCEPTED,
			})
			.or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);
		triggerLoadPendingFriend(friendId);
	};

	const declineFriend = async (friendId: string) => {
		await supabase.from("user_friends").delete().or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);
		triggerLoadPendingFriend(friendId);
	};

	return (
		<div className="mt-5">
			<PageTitle title="คำขอเพื่อนใหม่" />

			{friends.length > 0 ? (
				friends.map((u) => (
					<div key={u.id} className="my-1 py-1 flex justify-between items-center">
						<div className="flex gap-3 items-center">
							<Avatar>
								<AvatarImage src={u.image_profile} alt="avatar" />
							</Avatar>
							<div className="flex flex-col">
								<Label className="text-md">{u.name}</Label>
							</div>
						</div>

						<div className="flex gap-2">
							<Button type="button" variant={"default"} size={"icon"} onClick={() => acceptFriend(u.id)}>
								<CheckIcon />
							</Button>
							<Button type="button" variant={"outline"} size={"icon"} onClick={() => declineFriend(u.id)}>
								<XIcon />
							</Button>
						</div>
					</div>
				))
			) : (
				<h1 className="text-gray-400">ไม่พบใครเลย</h1>
			)}
		</div>
	);
}

