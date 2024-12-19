import avatar from "@/assets/avatar.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Menu } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function Navbar() {
	const { user, signOut } = useAuth();
	const location = useLocation();
	return (
		<nav className="flex justify-between py-5 px-4 bg-secondary">
			{location.pathname === "/note" ? (
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage
							src={`${
								import.meta.env.VITE_SUPABASE_PROJECT_URL
							}/storage/v1/object/public/user_image_profile/${user?.image_profile}`}
							alt="avatar"
						/>
						<AvatarFallback>{user?.name}</AvatarFallback>
					</Avatar>

					<div className="grid">
						<small className="text-muted-foreground">สวัสดี</small>
						<p>{user?.name}</p>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-3">
					<Button type="button" variant={"outline"} size={"icon"} asChild>
						<Link to={"/note"}>
							<ArrowLeftIcon />
						</Link>
					</Button>
				</div>
			)}

			<div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button type="button" variant="secondary">
							<Menu />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuLabel>
							<Link to={"/note"}>จดบันทึก</Link>
						</DropdownMenuLabel>
						<DropdownMenuLabel>
							<Link to={"/profile"}>โปรไฟล์</Link>
						</DropdownMenuLabel>
						<DropdownMenuLabel>
							<Link to={"/setting"}>ตั้งค่า</Link>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Dialog>
							<DialogTrigger asChild>
								<DropdownMenuLabel>ออกจากระบบ</DropdownMenuLabel>
							</DialogTrigger>

							<DialogContent className="max-w-[350px]">
								<DialogHeader>
									<DialogTitle>ออกจากระบบ</DialogTitle>
									<DialogDescription>ยืนยันว่าจะออกจากระบบ?</DialogDescription>
								</DialogHeader>

								<DialogFooter>
									<Button type="button" onClick={signOut}>
										ตกลง
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
}

