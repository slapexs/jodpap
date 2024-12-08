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
import { Menu } from "lucide-react";

export default function Navbar() {
	const { user, signOut } = useAuth();
	return (
		<nav className="flex justify-between py-5 px-4 bg-secondary">
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarImage src={avatar} alt="avatar" />
					<AvatarFallback>{user?.name}</AvatarFallback>
				</Avatar>

				<div className="grid">
					<small className="text-muted-foreground">สวัสดี</small>
					<p>{user?.name}</p>
				</div>
			</div>

			<div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button type="button" variant="secondary">
							<Menu />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuLabel>ตั้งค่า</DropdownMenuLabel>
						<DropdownMenuLabel>โปรไฟล์</DropdownMenuLabel>
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

