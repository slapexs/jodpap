import Category from "@/components/Category/Category";
import Friend from "@/components/Friend/Friend";
import Recent from "@/components/Recent/Recent";
import Summary from "@/components/Summary/Summary";
import { Button } from "@/components/ui/button";
import useFriend from "@/hooks/useFriend";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { Link } from "react-router";

export default function Note() {
	const { friends, isLoading } = useFriend();
	return (
		<>
			<MainLayout>
				<Summary />
				<div className="w-full gap-10 grid">
					<Friend friends={friends} isLoading={isLoading} />
					<Recent />

					<Category />

					<Button type="button" variant={"default"} size={"lg"} className="rounded-full" asChild>
						<Link to={"/add-note"}>จดบันทึก</Link>
					</Button>
				</div>
			</MainLayout>
		</>
	);
}

