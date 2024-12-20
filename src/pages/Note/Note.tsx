import Friend from "@/components/Friend/Friend";
import Summary from "@/components/Summary/Summary";
import { Button } from "@/components/ui/button";
import useFriend from "@/hooks/useFriend";
import useNote from "@/hooks/useNote";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

export default function Note() {
	const { friends, isLoading } = useFriend();
	const { amount, noteAmount } = useNote();
	return (
		<>
			<MainLayout>
				<Summary amount={amount} noteAmount={noteAmount} />
				<div className="w-full gap-10 grid">
					<Friend friends={friends} isLoading={isLoading} />
					{/* <Recent />

					<Category /> */}

					<Button
						type="button"
						variant={"default"}
						size={"lg"}
						className="rounded-full fixed bottom-10 mx-2 right-5"
						asChild
					>
						<Link to={"/add-note"}>
							<PlusIcon /> เพิ่มบันทึก
						</Link>
					</Button>
				</div>
			</MainLayout>
		</>
	);
}

