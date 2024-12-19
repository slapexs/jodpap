import { Avatar, AvatarImage } from "../ui/avatar";
import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import Loading from "../Loading/Loading";
import { Label } from "../ui/label";
import { User } from "@/types/user";

interface IFriendProps {
	friends: User[];
	isLoading: boolean;
}

export default function Friend({ friends, isLoading }: IFriendProps) {
	return (
		<div className="rounded-lg shadow px-3 py-2">
			<div className="flex justify-between">
				<h1 className="font-semibold">เพื่อน</h1>
				<Link to={"/search-friend"}>
					<Button type="button" variant={"secondary"} size={"icon"}>
						<UserPlusIcon />
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<Loading />
			) : (
				<section className="flex gap-3">
					{friends.length > 0 ? (
						friends.map((friend, index) => (
							<div className="flex justify-center flex-col items-center w-fit" key={index}>
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
						))
					) : (
						<p className="text-gray-400 text-center">ว่างเปล่า</p>
					)}
				</section>
			)}

			<p className="text-center text-slate-500 text-sm mt-2">
				<Link to={"/friend"}>ดูทั้งหมด</Link>
			</p>
		</div>
	);
}

