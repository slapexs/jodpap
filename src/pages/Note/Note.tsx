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
import { useAuth } from "@/hooks/useAuth";

export default function Note() {
	const { signOut } = useAuth();

	return (
		<>
			Note
			<Dialog>
				<DialogTrigger asChild>
					<Button type="button">Logout</Button>
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
		</>
	);
}

