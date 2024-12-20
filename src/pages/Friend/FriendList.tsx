import Loading from "@/components/Loading/Loading";
import PageTitle from "@/components/PageTitle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import useFriend from "@/hooks/useFriend";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { deleteFriend } from "@/utils/user";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function FriendList() {
	const { friends, isLoading, getUserFriends } = useFriend();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closeDialog = () => setIsOpen(false);

	return (
		<MainLayout>
			<PageTitle title="เพื่อน" />

			{!isLoading ? (
				<>
					<p className="text-gray-400">ทั้งหมด ({friends.length})</p>
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
										<Link to={`/friend/${u.id}`}>
											<Label className="text-md">{u.name}</Label>
										</Link>
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
										<Dialog open={isOpen} onOpenChange={setIsOpen}>
											<DialogTrigger asChild>
												<Button variant={"link"} className="text-left px-2 text-destructive">
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
													<Button
														type="button"
														onClick={async () => {
															await deleteFriend(u.id);
															await getUserFriends();
															closeDialog();
														}}
													>
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
				</>
			) : (
				<Loading />
			)}
		</MainLayout>
	);
}

