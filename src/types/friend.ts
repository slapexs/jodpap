import { friendStatusEnum } from "@/enums/friend.ts";
import { User } from "@/types/user.ts";

export interface IFriendResult {
	user: User;
	isFriend: boolean;
	status: friendStatusEnum | null;
}

export interface IUserFriend {
	id: string;
	user_id: string;
	friend_id: string;
	status: friendStatusEnum;
	created_at: string;
}

