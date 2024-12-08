import Category from "@/components/Category/Category";
import Friend from "@/components/Friend/Friend";
import Recent from "@/components/Recent/Recent";
import Summary from "@/components/Summary/Summary";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";

export default function Note() {
	return (
		<>
			<MainLayout>
				<Summary />
				<div className="w-full gap-10 grid">
					<Friend />
					<Recent />

					<Category />

					<Button type="button" variant={"default"} size={"lg"} className="rounded-full">
						จดบันทึก
					</Button>
				</div>
			</MainLayout>
		</>
	);
}

