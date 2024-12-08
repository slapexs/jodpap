import { Avatar, AvatarImage } from "../ui/avatar";
import User1 from "@/assets/user/user1.png";
import User2 from "@/assets/user/user2.png";
import User3 from "@/assets/user/user3.png";
import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function Friend() {
	return (
		<div className="rounded-lg shadow px-3 py-2">
			<div className="flex justify-between">
				<h1 className="font-semibold">เพื่อน</h1>
				<Button type="button" variant={"secondary"} size={"icon"}>
					<UserPlusIcon />
				</Button>
			</div>

			<section className="flex gap-3">
				<div className="flex justify-center flex-col items-center w-fit">
					<Avatar className="mt-1">
						<AvatarImage src={User1} />
					</Avatar>
					<small className="font-light">Jenny</small>
				</div>
				<div className="flex justify-center flex-col items-center w-fit">
					<Avatar className="mt-1">
						<AvatarImage src={User2} />
					</Avatar>
					<small className="font-light">Solo</small>
				</div>
				<div className="flex justify-center flex-col items-center w-fit">
					<Avatar className="mt-1">
						<AvatarImage src={User3} />
					</Avatar>
					<small className="font-light">Rose</small>
				</div>
			</section>
		</div>
	);
}

